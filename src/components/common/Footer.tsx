import React from "react";
import { Container, Box, Typography, Link, Stack, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 4,
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Copyright */}
          <Typography variant="body2">
            &copy; {currentYear} Food App. All Rights Reserved.
          </Typography>

          {/* Links */}
          <Stack direction="row" spacing={2}>
            <Link href="/home" color="inherit" underline="hover">
              Terms of Service
            </Link>
            <Link href="/home" color="inherit" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/home" color="inherit" underline="hover">
              Contact Us
            </Link>
          </Stack>

          {/* Social Icons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              color="inherit"
              aria-label="facebook"
              href="https://www.facebook.com"
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="twitter"
              href="https://www.twitter.com"
              target="_blank"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="instagram"
              href="https://www.instagram.com"
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="email"
              href="mailto:info@foodapp.com"
            >
              <EmailIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;