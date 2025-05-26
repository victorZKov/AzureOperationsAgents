import { useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const locales = useLocales();

  const popover = usePopover();

  const handleChangeLang = useCallback(
    (newLang: string) => {
      locales.onChangeLang(newLang);
      popover.onClose();
    },
    [locales, popover]
  );
    console.log("current language: ", locales.currentLang.value);
    console.log("icon: ", locales.currentLang.icon);
  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
          {locales.currentLang.value === 'eus' || locales.currentLang.value === 'ca' || locales.currentLang.value === 'gl' ?
              <img src={locales.currentLang.icon} alt={locales.currentLang.value} style={{ borderRadius: '0.65em', width: '28px' }} />
                :
        <Iconify icon={locales.currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />
            }
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {locales.allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === locales.currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
              {option.value === 'eus' || option.value === 'ca' || option.value === 'gl' ? 
                  
                  <img src={option.icon} alt={option.value} style={{ borderRadius: '0.65em', width: '28px', marginRight: '20px' }} />
                :
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />
                }

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
