import Express, { Application } from 'express';
import userRouter from '../../modules/user/presentation/routes/router';

const configureRouterServer=(app:Application)=>{
    app.use(userRouter);
}

export default configureRouterServer;