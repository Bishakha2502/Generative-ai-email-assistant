import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Button
} from '@mui/material';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedEmail = emailContent.trim();

    if (!trimmedEmail || loading) {
      setError('Please enter email content first.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post(
        'http://localhost:8081/api/email/generate',
        {
          emailContent: trimmedEmail,
          tone: tone || 'professional'
        }
      );

      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );

    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);

      setError(
        err.response?.data ||
        'Failed to generate email reply. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) return;

    try {
      await navigator.clipboard.writeText(generatedReply);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error(err);
      alert('Failed to copy text');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          placeholder="Paste the original email here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={generatedReply}
            slotProps={{
              htmlInput: {
                readOnly: true
              }
            }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleCopy}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;