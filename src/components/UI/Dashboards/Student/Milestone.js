import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const MilestoneContainer = styled(Box)(({ completed, theme }) => ({
  backgroundColor: completed ? '#dff0d8' : '#f2dede',
  color: completed ? '#3c763d' : '#a94442',
  padding: '12px 16px',
  borderRadius: '8px',
  margin: '5px',
  textAlign: 'center',
  width: '150px',
  boxShadow: completed ? '0 4px 8px rgba(0, 128, 0, 0.2)' : '0 2px 4px rgba(255, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: completed ? '#c3e6cb' : '#f9d6d6',
  },
}));

const Milestone = ({ title, completed }) => {
  return (
    <MilestoneContainer completed={completed}>
      <Typography variant="body1" fontWeight="bold">
        {title}
      </Typography>
    </MilestoneContainer>
  );
};

export default Milestone;