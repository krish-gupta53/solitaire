import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import axios from 'axios';
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateMemoryTest = async (req, res) => {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: 'Generate a memory test with a list of random numbers and delay duration.',
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
      }
    );
    const config = JSON.parse(response.data.choices[0].text.trim());
    const test = await Test.create({
      type: 'memory',
      instructions: 'Memorize the numbers and recall them.',
      config,
    });
    res.status(200).json(test);
  };
const evaluateMemoryTest = async (req, res) => {
    const { testId, userId, userResponse } = req.body;
    const test = await Test.findById(testId);
    const correctAnswer = test.config.numbers.join('');
    const score = userResponse === correctAnswer ? 100 : 0;
    await Performance.create({ userId, testId, type: 'memory', score });
    res.status(200).json({ score });
  };

  const generateAttentionTest = async (req, res) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: 'Create an attention test where users must find the odd object in a grid of images.',
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
        }
      );
  
      const config = JSON.parse(response.data.choices[0].text.trim());
      const test = await Test.create({
        type: 'attention',
        instructions: 'Find the odd object in the grid.',
        config,
      });
  
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ error: 'Error generating attention test' });
    }
  };
  const evaluateAttentionTest = async (req, res) => {
    const { testId, userId, responses } = req.body;
  
    try {
      const test = await Test.findById(testId);
      const correctAnswers = test.config.correctAnswers; // e.g., positions of odd items
      const score = responses.reduce(
        (sum, response, index) => (response === correctAnswers[index] ? sum + 10 : sum),
        0
      );
  
      await Performance.create({ userId, testId, type: 'attention', score });
      res.status(200).json({ score });
    } catch (error) {
      res.status(500).json({ error: 'Error evaluating attention test' });
    }
  };
  
  const generateReactionTest = async (req, res) => {
    try {
      const config = {
        duration: 10, // Total time in seconds
        targetColor: 'red', // Example cue to click on
      };
  
      const test = await Test.create({
        type: 'reaction-time',
        instructions: 'Click as quickly as possible when the object turns red.',
        config,
      });
  
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ error: 'Error generating reaction time test' });
    }
  };
  const evaluateReactionTest = async (req, res) => {
    const { testId, userId, responseTimes } = req.body;
  
    try {
      const averageTime =
        responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  
      await Performance.create({
        userId,
        testId,
        type: 'reaction-time',
        score: Math.max(0, 100 - averageTime), // Example scoring logic
      });
  
      res.status(200).json({ averageTime, score: Math.max(0, 100 - averageTime) });
    } catch (error) {
      res.status(500).json({ error: 'Error evaluating reaction time test' });
    }
  };

  const generateProblemSolvingTest = async (req, res) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: 'Generate a logical reasoning puzzle or math question for a problem-solving test.',
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
        }
      );
  
      const config = JSON.parse(response.data.choices[0].text.trim());
      const test = await Test.create({
        type: 'problem-solving',
        instructions: 'Solve the given puzzle or math problem.',
        config,
      });
  
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ error: 'Error generating problem-solving test' });
    }
  };
  const evaluateProblemSolvingTest = async (req, res) => {
    const { testId, userId, userAnswer } = req.body;
  
    try {
      const test = await Test.findById(testId);
      const correctAnswer = test.config.correctAnswer;
      const score = userAnswer === correctAnswer ? 100 : 0;
  
      await Performance.create({ userId, testId, type: 'problem-solving', score });
      res.status(200).json({ score });
    } catch (error) {
      res.status(500).json({ error: 'Error evaluating problem-solving test' });
    }
  };
  
const recommendTests = async (req, res) => {
    const performances = await Performance.find({ userId: req.userId });
    const weakAreas = performances
      .filter((p) => p.score < 50)
      .map((p) => p.type);
    res.status(200).json({
      recommendedTests: [...new Set(weakAreas)],
      lifestyleTips: ['Sleep 7-8 hours daily', 'Practice mindfulness', 'Exercise regularly'],
    });
  };
    
  
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});



const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    
    getUserChannelProfile,
    getWatchHistory
}