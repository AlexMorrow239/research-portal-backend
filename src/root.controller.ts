import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  @Redirect('/api/v1', 301)
  redirectToApi() {
    return;
  }
}