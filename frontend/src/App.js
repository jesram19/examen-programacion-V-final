import React, { useState } from 'react';
import { 
  Container, Box, Typography, TextField, FormControl, 
  InputLabel, Select, MenuItem, Button, Alert, Grid 
} from '@mui/material';

function App() {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    motivo: '',
    mensaje: ''
  });

  const [alerta, setAlerta] = useState({ mostrar: false, tipo: '', texto: '' });

  const manejarCambio = (evento) => {
    setDatosFormulario({
      ...datosFormulario,
      [evento.target.name]: evento.target.value
    });
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    try {
      // fetch al backend de flask
      const respuesta = await fetch('http://127.0.0.1:5000/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario),
      });

      if (respuesta.status === 201) {
        setAlerta({ mostrar: true, tipo: 'success', texto: 'Mensaje enviado correctamente' });
        // limpiar form
        setDatosFormulario({ nombre: '', apellido: '', correo: '', motivo: '', mensaje: '' });
      } else {
        setAlerta({ mostrar: true, tipo: 'error', texto: 'Hubo un error al enviar' });
      }
    } catch (error) {
      setAlerta({ mostrar: true, tipo: 'error', texto: 'Error de conexion con el servidor' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Contacto
        </Typography>

        {alerta.mostrar && (
          <Alert severity={alerta.tipo} sx={{ mb: 3 }}>
            {alerta.texto}
          </Alert>
        )}

        <form onSubmit={manejarEnvio}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Nombre" name="nombre" value={datosFormulario.nombre} onChange={manejarCambio} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Apellido" name="apellido" value={datosFormulario.apellido} onChange={manejarCambio} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth required type="email" label="Correo Electrónico" name="correo" value={datosFormulario.correo} onChange={manejarCambio} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="label-motivo">Motivo de contacto</InputLabel>
                <Select labelId="label-motivo" label="Motivo de contacto" name="motivo" value={datosFormulario.motivo} onChange={manejarCambio}>
                  <MenuItem value="Informacion">Información</MenuItem>
                  <MenuItem value="Queja">Queja</MenuItem>
                  <MenuItem value="Soporte">Soporte Técnico</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth required multiline rows={4}
                label="Cuerpo del mensaje" name="mensaje"
                value={datosFormulario.mensaje} onChange={manejarCambio}
                inputProps={{ maxLength: 500 }}
                helperText={`${datosFormulario.mensaje.length} / 500 caracteres`}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" color="primary" size="large">
                Enviar Formulario
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default App;