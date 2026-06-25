import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, CssBaseline } from '@mui/material';
import { Activity, History, Stethoscope, BookOpen } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Activity size={22} />, path: '/' },
    { text: 'Pacientes', icon: <Stethoscope size={22} />, path: '/pacientes' },
    { text: 'Nova Predição', icon: <Activity size={22} />, path: '/predicao/nova' },
    { text: 'Histórico', icon: <History size={22} />, path: '/history' },
    { text: 'Sobre os Modelos', icon: <BookOpen size={22} />, path: '/sobre-modelos' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: '#FFFFFF',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              Sistema Inteligente de Predição de Desfecho Clínico
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0F52BA',
            color: '#FFFFFF',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ backgroundColor: 'white', color: '#0F52BA', p: 1, borderRadius: 2 }}>
             <Stethoscope size={28} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Saúde<br/>Predict
          </Typography>
        </Box>
        
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8, // Toolbar spacing
          maxWidth: '1200px',
          margin: '64px auto 0 auto',
        }}
      >
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#E0F2FE', borderRadius: 2, borderLeft: '4px solid #0EA5E9' }}>
          <Typography variant="body2" sx={{ color: '#0369A1', fontWeight: 500 }}>
            <strong>Informação Importante:</strong> Modelo treinado exclusivamente com dados da Região Norte do Brasil. Os resultados devem ser utilizados apenas como ferramenta de apoio à decisão clínica e não substituem a avaliação médica.
          </Typography>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
};
