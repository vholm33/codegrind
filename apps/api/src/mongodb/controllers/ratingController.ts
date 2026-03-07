import type { Response, Request } from 'express';
import type { Rating } from '../types/ratingTypes.js';

import { getAllCodeQuestionsRepo } from '../../mysql/repositories/codeQuestions.repo.js';
//! import Rating from '../models/ratingModel.js'; (bara för mongoose)
import { mdbConn } from '../connection.js';

export async function addRatingController(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] addRatingController(req, res)`);

        // SQL: Get userId and questionId
        // const { userId, questionId } = req.body;

        // [x] id - code question ID
        // [x] userRating - användarens rating
        // [ ] sqlUserId - inloggad användares ID: users.id
        const { id, userRating, sqlUserId } = req.body;
        if (!id || !userRating) {
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

        await mdbConn.collection<Rating>('ratings').insertOne({
            sqlId: id,
            userRating: userRating,
            // sqlUserId: 5,
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
