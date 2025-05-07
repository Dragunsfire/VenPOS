export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || 'Error de autenticación', data };
    }
    return { data };
  } catch (error) {
    return { error: 'Error de conexión con el servidor', data: error };
  }
};

export const registerUser = async (formData) => {
  try {
    console.log('Enviando datos de registro:', formData);
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        nombre: formData.representante,
        rol_id: 1,
        empresa: {
          nombre_empresa: formData.nombre_empresa,
          rif: formData.rif,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          estado: 'activo',
          representante: formData.representante,
          logo: '',
          pais: formData.pais,
          ciudad: formData.ciudad,
          municipio: formData.municipio,
          edo_estado: formData.edo_estado,
          sector_economico: formData.sector_economico,
          actividad_economica: formData.actividad_economica
        }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.log('Respuesta error del backend:', data);
      return { ok: false, error: data.message || 'Error desconocido', data };
    }
    console.log('Usuario registrado correctamente:', data);
    return { ok: true, data };
  } catch (error) {
    console.log('Error de conexión con el servidor:', error);
    return { ok: false, error: 'Error de conexión con el servidor', data: error };
  }
};
  