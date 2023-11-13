import { connect } from 'mongoose';

export default function dbConnection() {
    connect(process.env.MONGO_URI).then(con => {
        console.log(`MongoDB connected with HOST: ${con.connection.host}`);
    });
}