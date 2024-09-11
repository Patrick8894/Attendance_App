const { getAllAppeals, createAppeal, reviewAppeal } = require('../../controllers/appealController');
const Appeal = require('../../models/appealModel');
const Attendance = require('../../models/attendanceModel');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../models/appealModel');
jest.mock('../../models/attendanceModel');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Appeal Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAppeals', () => {
    it('should return all appeals', async () => {
      const mockAppeals = [{ _id: '1', uin: '123', classId: 'abc', appealReason: 'reason' }];
      Appeal.find.mockResolvedValue(mockAppeals);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllAppeals(req, res);

      expect(Appeal.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAppeals);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');
      Appeal.find.mockRejectedValue(mockError);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllAppeals(req, res);

      expect(Appeal.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('createAppeal', () => {
    it('should create a new appeal', async () => {
      const req = {
        body: { uin: '123', classId: 'abc', appealReason: 'reason' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Attendance.findOne.mockResolvedValue(null);
      Appeal.findOne.mockResolvedValue(null);
      Appeal.prototype.save = jest.fn().mockResolvedValue(req.body);

      await createAppeal(req, res);

      expect(Attendance.findOne).toHaveBeenCalledWith({ uin: '123', classId: 'abc' });
      expect(Appeal.findOne).toHaveBeenCalledWith({ uin: '123', classId: 'abc' });
      expect(Appeal.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should handle existing attendance record', async () => {
      const req = {
        body: { uin: '123', classId: 'abc', appealReason: 'reason' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Attendance.findOne.mockResolvedValue(req.body);

      await createAppeal(req, res);

      expect(Attendance.findOne).toHaveBeenCalledWith({ uin: '123', classId: 'abc' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Attendance record already exists for this UIN and Class ID' });
    });

    it('should handle existing appeal record', async () => {
      const req = {
        body: { uin: '123', classId: 'abc', appealReason: 'reason' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Attendance.findOne.mockResolvedValue(null);
      Appeal.findOne.mockResolvedValue(req.body);

      await createAppeal(req, res);

      expect(Appeal.findOne).toHaveBeenCalledWith({ uin: '123', classId: 'abc' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appeal record already exists for this UIN and Class ID' });
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');
      const req = {
        body: { uin: '123', classId: 'abc', appealReason: 'reason' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Attendance.findOne.mockRejectedValue(mockError);

      await createAppeal(req, res);

      expect(Attendance.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });
  describe('reviewAppeal', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: { id: 'appealId' },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      uuidv4.mockReturnValue('uuid');
    });

    it('should return 404 if appeal is not found', async () => {
      Appeal.findById.mockResolvedValue(null);

      await reviewAppeal(req, res);

      expect(Appeal.findById).toHaveBeenCalledWith('appealId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appeal not found' });
    });

    it('should update appeal and create new attendance', async () => {
      const mockAppeal = {
        _id: 'appealId',
        uin: '123',
        classId: 'abc',
        appealStatus: 'pending',
        save: jest.fn().mockResolvedValue({
          _id: 'appealId',
          uin: '123',
          classId: 'abc',
          appealStatus: 'approved',
        }),
      };
      Appeal.findById.mockResolvedValue(mockAppeal);
      Attendance.prototype.save = jest.fn().mockResolvedValue({
        _id: 'uuid',
        uin: '123',
        classId: 'abc',
        date: new Date(),
        takenBy: 'appeal system',
      });

      await reviewAppeal(req, res);

      expect(Appeal.findById).toHaveBeenCalledWith('appealId');
      expect(mockAppeal.save).toHaveBeenCalled();
      expect(Attendance.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        updatedAppeal: {
          _id: 'appealId',
          uin: '123',
          classId: 'abc',
          appealStatus: 'approved',
        },
        newAttendance: {
          _id: 'uuid',
          uin: '123',
          classId: 'abc',
          date: expect.any(Date),
          takenBy: 'appeal system',
        },
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      Appeal.findById.mockRejectedValue(new Error(errorMessage));

      await reviewAppeal(req, res);

      expect(Appeal.findById).toHaveBeenCalledWith('appealId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
