export const getTenant = (email) => {
  try {
    const domain=email.split('@')[1];
    const user=domain.split('.')[0];
    return user.toLowerCase();
  } catch (error) {
    console.log(error);
    throw new Error("Error getting Tenant");
  }
};
