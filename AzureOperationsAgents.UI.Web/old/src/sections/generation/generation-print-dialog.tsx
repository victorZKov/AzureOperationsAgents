import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocales } from "../../locales";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface Props {
    generatedImage: string | null;
    open: boolean;
    onClose: VoidFunction;
}

export default function GenerationPrintDialog({
      generatedImage,
      open,
      onClose
  }: Props) {
    const { t } = useLocales();

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({contentRef});

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                {t('fileManager.print-image')}
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
                <div ref={contentRef}>
                    {generatedImage && (
                        <img
                            src={generatedImage}
                            alt="Generated"
                            style={{ maxWidth: '100%', borderRadius: '10px' }}
                            
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        if (!contentRef.current) {
                            console.error('Print content is missing.');
                            return;
                        }
                        handlePrint();
                    }}
                    variant="contained"
                    color="primary"
                    
                >
                    {t('fileManager.print')}
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    {t('fileManager.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}