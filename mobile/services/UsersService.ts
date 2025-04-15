export const UsersService = {
    getUsers: async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
  
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
  
        const data = await response.json();
        return { success: true, users: data };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  };
  

