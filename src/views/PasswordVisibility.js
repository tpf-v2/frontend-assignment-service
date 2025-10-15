import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const togglePasswordVisibility = (showPassword, setShowPassword) => ({
    endAdornment: (
        <InputAdornment position="end">
            <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
            >
            {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    )
})