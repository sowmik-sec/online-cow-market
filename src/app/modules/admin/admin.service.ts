import { IAdmin } from './admin.interface';
import { Admin } from './admin.mode';

const createAdmin = async (admin: IAdmin): Promise<IAdmin> => {
  return await Admin.create(admin);
};

export const AdminService = {
  createAdmin,
};
