const { ExplainVerbosity } = require("mongodb");
const { signupSchema, acceptCodeSchema, changePasswordSchema, acceptFPCodeSchema, signinSchema} = require("../middlewares/validator");
const usersModel = require("../models/usersModel");
const { doHash } = require("../utils/hashing");
const { doHashValidation } = require("../utils/hashing");
const jwt=require('jsonwebtoken');
const transporter=require('../middlewares/sendMail');
const { hmacProcess } = require('../utils/hashing');
const identifier=require('../middlewares/identification');

//Registration of a new user
exports.signup = async (req, res) => {
    const { email, password, fullName, phone } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password, fullName, phone });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await usersModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await doHash(password, 10);

        const newUser = new usersModel({
            email: email,
            password: hashedPassword,
            fullName: fullName,
            phone: phone
        });

        const result = await newUser.save();
        result.password = undefined;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result
        });
    } catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try{
        const {error,value}=signinSchema.validate({email,password});
        if(error){
            return res.status(401).json({success:false,message:error.details[0].message});
        }
        const existingUser=await usersModel.findOne({email}).select('+password');
        if(!existingUser){
            return res.status(401).json({success:false,message:"User does not exist"});
        }

        const result=await doHashValidation(password,existingUser.password);
        if(!result){
            return res.status(401).json({success:false,message:"Invalid password"});
        }
        const token=jwt.sign({
            userId:existingUser._id,
            email:existingUser.email,
            verified:existingUser.verified
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'8h',
        }
        );
        res.cookie('Authorization','Bearer '+token,{ expires: new Date(Date.now()+86400000),httpOnly:process.env.NODE_ENV==='production'?true:false,secure:process.env.NODE_ENV==='production'?true:false}).json({
            success:true,
            token:token,
            message:"User signed in successfully",
            user: {
                email: existingUser.email,
                name: existingUser.fullName,
                phone: existingUser.phone
              }
        });
    }catch(error){
        console.log("Error in signin",error);
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('Authorization').status(200).json({
        success:true,
        message:"User logged out successfully"
    });
}


exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try{
        const existingUser=await usersModel.findOne({email:email});
        if(!existingUser){
            return res.status(404)
            .json({success:false,message:"User does not exist"});
        }
        if(existingUser.verified){
            return res.status(400)
            .json({success:false,message:"User already verified"});
        }
        const codeValue=Math.floor(100000+Math.random()*900000).toString();
        let info=await transporter.sendMail({
            from:process.env.NODE_EMAIL,
            to:existingUser.email,
            subject:"Verification Code ",
            text:`Your verification code is ${codeValue}`
        });

        if(info.accepted[0]=== existingUser.email){
            const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_SECRET);
            existingUser.verificationCode=hashedCodeValue;
            existingUser.verificationCodeValidation=Date.now();
            await existingUser.save();
            return res.status(200).json({success:true,message:"Verification code sent successfully"});
        }
        res.status(500).json({success:false,message:"Error in sending verification code"});
    } catch (error) {
        console.log("Error in sendVerificationCode", error);
    }
};

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;
    try{
        const {error,value}=acceptCodeSchema.validate({email,providedCode});
        if(error){
            return res.status(401).json({success:false,message:error.details[0].message});
        }

        const codeValue=providedCode.toString();
        const existingUser=await usersModel.findOne({email}).select('+verificationCode +verificationCodeValidation');

        if(!existingUser){
            return res.status(401)
            .json({success:false,message:"User does not exist"});
        }

        if(existingUser.verified){
            return res.status(400)
            .json({success:false,message:"User already verified"});
        }
        
         if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
             return res.status(400)
             .json({success:false,message:"Unknown error occured"});
        }

        // 5 minutes validation
        if(Date.now()-existingUser.verificationCodeValidation>5*60*1000){
            return res.status(400)
            .json({success:false,message:"Verification code expired"});
        }

        const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_SECRET);

        if(hashedCodeValue===existingUser.verificationCode){
            existingUser.verified=true;
            existingUser.verificationCode=undefined;
            existingUser.verificationCodeValidation=undefined;
            await existingUser.save();
            return res.status(200).json({success:true,message:"User verified successfully"});                                                                   
        }
        return res.status(400).json({success:false,message:"Invalid verification code"});
    } catch (error) {
        console.log("Error in verifyVerificationCode", error);
    }
}