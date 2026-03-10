import type { Response, Request } from 'express';
import type { Rating } from '../types/ratingTypes.js';

import { getAllCodeQuestionsRepo } from '../../mysql/repositories/codeQuestions.repo.js';
//! import Rating from '../models/ratingModel.js'; (bara för mongoose)
import { mdbConn } from '../connection.js';
import { Db } from 'mongodb';

interface GetRating {
    sqlQuestionId: number; //
    sqlUserId: number; // user.id
    userRating: number;
    comment?: string;
}

export async function addRating(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] addRatingController(req, res)`);

        // SQL: Get userId and questionId
        // const { userId, questionId } = req.body;

        // [x] id - code question ID
        // [x] userRating - användarens rating
        // [ ] sqlUserId - inloggad användares ID: users.id
        const { id, userRating, sqlUserId } = req.body;
        //! sqlUserId
        if (!id || !userRating || !sqlUserId) {
            return res.status(401).json({
                success: false,
                message: 'Saknar SQLs fråge ID eller userRating',
            });
        }
        console.log('fråge ID och userRating hittat');
        const foundId = getAllCodeQuestionsRepo(id);
        console.log('foundId from SQL:', foundId);

        console.log('Använd id för att sätta rating i MongoDB');
        const existingRatings = mdbConn.collection('ratings');
        console.log('existingRatings:', existingRatings);
        /* const addedRating = new Rating({
            questionId: id, //? foundId
            userRating: userRating,
        }); */

        // console.log('Waiting to save new user rating...');
        /* await addedRating.save(); */

        await mdbConn.collection<GetRating>('ratings').insertOne({
            sqlQuestionId: id,
            userRating: userRating,
            sqlUserId: sqlUserId
        });

        (await existingRatings.find().toArray()).forEach((rating: any) => {
            console.log('============');
            console.log(rating._id); //* new ObjectId('69a98a32f1586786271c1934')
            console.log(rating.id); //! undefined
            console.log(rating.userRating); //* 5
            console.log('============');
        });

        return res.status(201).json({
            success: true,
            message: 'SUCCESS, ny rating tillaggd',
            //data: addedRating,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

export async function getRating(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] getRatingsC(req, res)');

        const collection = mdbConn.collection<GetRating>('ratings');

        // get all
        const allRatings: GetRating[] = await collection.find().toArray();
        console.log(allRatings);

        return res.json({
            success: true,
            data: allRatings,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}
