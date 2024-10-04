import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const MilestoneContainer = styled(Box)(({ completed }) => ({
  backgroundColor: completed ? '#c8debf' : '#e0e0e0',
  color: completed ? '#146b34' : '#7a7979',
  padding: '10px 8px',
  borderRadius: '8px',
  margin: '5px',
  textAlign: 'center',
  width: '100%',
  boxShadow: completed ? '0 4px 8px #146b34' : '0 2px 4px #919191',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: completed ? '#c8debf' : '#e0e0e0',
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