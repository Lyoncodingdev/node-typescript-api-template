import { Service } from 'typedi';
import { ILogger, LoggerToken } from '../util/ILogger';
import { Inject } from 'typedi';
import * as admin from 'firebase-admin';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Service for interacting with
 */
@Service()
export class AuthService {
    constructor(
        @Inject(LoggerToken) private logger: ILogger
    ) {
        this.initialize();
    }

    private initialize() {
        if (admin.apps.length === 0) {
            try {
                if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
                    const serviceAccount = require(serviceAccountPath);

                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                }

                else {
                    const serviceAccountPath = path.join(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
                    const serviceAccount = require(serviceAccountPath);

                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                }

                this.logger.info('Firebase Admin SDK initialized successfully');
            } catch (error) {
                this.logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
                throw error;
            }
        } else {
            this.logger.error("No Admin Apps.");
        }
    }
}