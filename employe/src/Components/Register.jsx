import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER", // default selected role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        roles: [formData.role], // send as array for backend
      };
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        payload
      );
      setSuccessMessage(response.data);
      setFormData({ username: "", password: "", role: "USER" });
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8f9fa"
    >
      <Card sx={{ width: 400, padding: 3, borderRadius: "12px", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
          >
            Register
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              size="medium"
              autoComplete="username"
            />

            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              size="medium"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: "medium", mb: 1 }}>
                Select Role
              </FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel value="USER" control={<Radio />} label="User" />
                <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                sx={{ fontWeight: "medium" }}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </form>

          {successMessage && (
            <Typography mt={2} color="success.main" align="center">
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography mt={2} color="error.main" align="center">
              {errorMessage}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
