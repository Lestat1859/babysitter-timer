import React from 'react';
import { Container, Card, Avatar, Typography, Button, useTheme } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { firebaseAuth } from '../../utils/firebase';

const PendingApproval = () => {
  const theme = useTheme();

  const handleSignOut = () => {
    firebaseAuth.signOut();
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 8, p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
        <Avatar sx={{ m: 'auto', bgcolor: theme.palette.warning.light, mb: 2 }}>
          <HourglassEmptyIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Validation en cours
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Votre inscription a bien été prise en compte. Pour des raisons de sécurité, l'accès à l'application nécessite une validation manuelle par un administrateur.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Vous recevrez une notification (ou pourrez vous connecter) une fois votre compte activé.
        </Typography>
        <Button variant="contained" onClick={handleSignOut} sx={{ mt: 2 }}>
          Se déconnecter
        </Button>
      </Card>
    </Container>
  );
};

export default PendingApproval;
