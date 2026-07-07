const { AuthModel } = require('../../../src/model/auth.model.js');

describe('AuthModel', () => {
  // signIn
  it('should return an error when signing in with an invalid email format', async () => {
    const { error } = await AuthModel.signIn('notanemail', 'password123');
    expect(error).not.toBeNull();
  });

  it('should return an error when signing in with a non-existent email', async () => {
    const { error } = await AuthModel.signIn('nonexistent@email.com', 'password123');
    expect(error).not.toBeNull();
  });

  it('should return an error when signing in with a wrong password', async () => {
    const { error } = await AuthModel.signIn('admin@cakelytics.com', 'wrongpassword');
    expect(error).not.toBeNull();
  });

  // getAdminById
  it('should return an error when fetching an admin with a non-existent id', async () => {
    const { error } = await AuthModel.getAdminById('00000000-0000-0000-0000-000000000000');
    expect(error).not.toBeNull();
  });

  it('should return an error when fetching an admin with an invalid uuid format', async () => {
    const { error } = await AuthModel.getAdminById('not-a-valid-uuid');
    expect(error).not.toBeNull();
  });

//   it('should return the admin record when fetching by a valid existing id', async () => {
//     // Palitan mo ito ng totoong id na nasa admins table mo sa Supabase
//   const { data, error } = await AuthModel.getAdminById('e1e0cbf6-f028-4ce5-b008-9913a67eddf6'); 
//   console.log(data); // ipapakita nito sa terminal yung laman kung ano man nilagay niyo sa id na iyon, para ma-verify mo kung tama yung data na nakuha mo
//   expect(error).toBeNull();
//   expect(data).toHaveProperty('name');
// });
});