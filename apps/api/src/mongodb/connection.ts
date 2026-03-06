import { MongoClient } from 'mongodb';

export const mdbConn = new MongoClient('mongodb://localhost:27017').db('CodeGrind');
