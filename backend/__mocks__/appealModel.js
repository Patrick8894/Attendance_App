const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockSave = jest.fn();

const Appeal = {
  find: mockFind,
  findOne: mockFindOne,
  save: mockSave,
};

module.exports = Appeal;