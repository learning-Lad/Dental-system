const onSubmitHandler = async (event) => {
    event.preventDefault();

    
    const safeBackendUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${safeBackendUrl}/api/admin/login`, { email, password });
        
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem('aToken', data.token);
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(`${safeBackendUrl}/api/doctor/login`, { email, password });
        
        if (data.success) {
          setDToken(data.token);
          localStorage.setItem('dToken', data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // This catches the network/404 errors and prevents the "Uncaught (in promise)" crash!
      console.error("Login API Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong during login.");
    }
  }
