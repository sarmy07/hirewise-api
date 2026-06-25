import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleConfig from '../config/google.config';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientId!,
      clientSecret: googleConfiguration.client_secret!,
      callbackURL: googleConfiguration.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails } = profile;

    const tokens = await this.authService.validategoogleUser({
      googleId: id,
      name: displayName,
      email: emails[0].value,
    });

    done(null, tokens);
  }
}
