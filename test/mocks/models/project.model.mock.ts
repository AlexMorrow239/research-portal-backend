export const mockProjectModel = {
  create: jest.fn(),
  find: jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  })),
  findById: jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  })),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(() => ({
    populate: jest.fn(),
  })),
  findOneAndDelete: jest.fn(() => ({
    lean: jest.fn(),
  })),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
  db: {
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        project: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue([]),
        })),
      })),
    })),
  },
};
