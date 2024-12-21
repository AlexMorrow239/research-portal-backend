import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface Test {
  name: string;
}

@Injectable()
export class TestService {
  constructor(@InjectModel('Test') private testModel: Model<Test>) {}

  async createTest(name: string): Promise<Test> {
    const createdTest = new this.testModel({ name });
    return createdTest.save();
  }
}
