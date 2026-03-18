import type { Response, Request } from 'express';
import type { Rating, ApiResponse } from '@shared/types.js';
import { mdbConn } from '../connection.js';

// UPDATE / POST
export async function addRating(
    req: Request,
    res: Response<ApiResponse>
): Promise<Response<ApiResponse>> {
    try {
        console.log('addRating() handling update/post');
        const { sqlQuestionId, userRating, sqlUserId } = req.body;
        console.log('red.body', req.body);

        if (!sqlQuestionId || !userRating || !sqlUserId) {
            return res.status(401).json({
                success: false,
                message: 'Saknar sqlQuestionId eller userRating',
            });
        }

        const ratingsCollection = mdbConn.collection<Rating>('ratings');

        const filter = {
            sqlQuestionId: sqlQuestionId,
            sqlUserId: sqlUserId, // Måste matcha båda.
        };

        const update = {
            $set: {
                userRating: userRating,
                updatedAt: new Date(),
            },
            $setOnInsert: {
                createdAt: new Date(), // bara vid insert
            },
        };

        const result = await ratingsCollection.updateOne(filter, update, {
            upsert: true, // insert om inte hittas, annars uppdatera hittad
        });

        const wasUpdated = result.matchedCount > 0;
        const wasInserted = result.upsertedCount > 0;

        return res.status(wasInserted ? 201 : 200).json({
            success: true,
            message: wasUpdated ? 'Rating uppdaterad' : 'Lade till ny rating',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//* SUCCESS
/* export async function addRating(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] addRatingController(req, res)`);

        // SQL: Get userId and questionId
        // const { userId, questionId } = req.body;

        // [x] id - code question ID
        // [x] userRating - användarens rating
        // [ ] sqlUserId - inloggad användares ID: users.id
        const { sqlQuestionId, userRating, sqlUserId } = req.body;
        console.log('req.body', req.body);

        if (!sqlQuestionId || !userRating || !sqlUserId) {
            return res.status(401).json({
                success: false,
                message: 'Saknar SQLs fråge ID eller userRating',
            });
        }
        console.log('fråge ID och userRating hittat');
        const foundId = getAllCodeQuestionsRepo(sqlQuestionId);
        console.log('foundId from SQL:', foundId);

        console.log('Använd id för att sätta rating i MongoDB');
        const existingRatings = mdbConn.collection('ratings');
        console.log('existingRatings:', existingRatings);

        await mdbConn.collection<Rating>('ratings').insertOne({
            sqlQuestionId: sqlQuestionId,
            userRating: userRating,
            sqlUserId: sqlUserId,
        });

        (await existingRatings.find().toArray()).forEach((rating: any) => {
            console.log('============');
            console.log(rating._id); //* new ObjectId('69a98a32f1586786271c1934')
            console.log(rating.sqlQuestionId); //! undefined
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
} */

export async function getRating(_req: Request, res: Response<ApiResponse<Rating[]>>): Promise<Response> {
    try {
        console.log('[CONTROLLER] getRating(req, res)');

        const collection = mdbConn.collection<Rating>('ratings');

        console.log('getting all ratings...');
        // get all
        const allRatings: Rating[] = await collection.find().toArray();
        console.log('All ratings', allRatings);

        return res.status(200).json({
            success: true,
            message: 'Skickar tillbaks alla ratings.',
            // måste ha message
            data: allRatings,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}
