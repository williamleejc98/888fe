import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { yariga } from "../assets";
import { CredentialResponse } from "../interfaces/google";

export const Login: React.FC = () => {
    const { mutate: login } = useLogin<CredentialResponse>({
        v3LegacyAuthProviderCompatible: true,
    });

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        // Perform your login logic here
        // You can use the 'email' and 'password' states to send a login request
        try {
            // Replace this with your actual login logic
            const response = await yourLoginFunction(email, password);

            // If login is successful, call the login mutation
            if (response.success) {
                login(response.data); // You may need to format 'response.data' appropriately
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box component="div" sx={{ backgroundColor: "#FCFCFC" }}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <img src={yariga} alt="Yariga Logo" />
                    </div>
                    <Box mt={4}>
                        {/* Login Form */}
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
