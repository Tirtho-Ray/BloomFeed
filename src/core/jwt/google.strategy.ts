import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('google.google_client');
    const clientSecret = config.get<string>('google.google_client_secret');
    const callbackURL = config.get<string>('google.google_callback_url');

    super({
      clientID: clientID!,
      clientSecret: clientSecret!,
      callbackURL: callbackURL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id, _json } = profile;

    const user = {
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      email_verified: _json.email_verified,
      accessToken,
    };

    done(null, user);
  }
}
