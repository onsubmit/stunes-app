import dotenv from 'dotenv';

dotenv.config();

class Constants {
  static get client_id(): string {
    const value = process.env.CLIENT_ID;
    if (!value) {
      throw new Error('Invalid CLIENT_ID');
    }

    return value;
  }

  static get client_secret(): string {
    const value = process.env.CLIENT_SECRET;
    if (!value) {
      throw new Error('Invalid CLIENT_SECRET');
    }

    return value;
  }

  static get redirect_uri(): string {
    const value = process.env.REDIRECT_URI;
    if (!value) {
      throw new Error('Invalid REDIRECT_URI');
    }

    return value;
  }
}

export default Constants;
