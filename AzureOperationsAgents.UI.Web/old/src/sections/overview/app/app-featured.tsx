import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import {useLocales} from "../../../locales";
import {ILatestImage} from "../../../types/dashboard";
import {Button} from "@mui/material";

// ----------------------------------------------------------------------

type ItemProps = {
    Id: string;
    Title: string;
    CoverUrl: string;
    Description: string;
};

interface Props extends CardProps {
    list: ILatestImage[];
}

export default function AppFeatured({ list, ...other }: Props) {
    
    const { t } = useLocales();
    
    const carousel = useCarousel({
        speed: 800,
        autoplay: true,
        // @ts-ignore
        appendDots: (dots: React.ReactNode) => (
            <div
                style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {dots}
            </div>
        ),
        customPaging: () => <span style={{ color: 'white' }}>•</span>,
    });
    const SafeCarousel = Carousel as any;
    return (
        <Card {...other}>

            <SafeCarousel
                ref={carousel.carouselRef as React.RefObject<any>}
                {...(carousel.carouselSettings as any)}
            >
                {list.map((app, index) => (
                    <CarouselItem key={app.Id} item={app} active={index === carousel.currentIndex} />
                ))}
            </SafeCarousel>

            <CarouselArrows
                onNext={carousel.onNext}
                onPrev={carousel.onPrev}
                sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
    item: ILatestImage;
    active?: boolean;
};

function CarouselItem({ item, active }: CarouselItemProps) {
    
    const { t } = useLocales();
    
    const theme = useTheme();

    const { CoverUrl, Title, Description } = item;

    const renderImg = (
        // <Link href={`/dashboard/generation?image=${CoverUrl}`} >
        <Image
            alt={Title}
            src={CoverUrl}
            overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
                theme.palette.grey[900]
            } 90%)`}
            sx={{
                width: 1,
                height: {
                    xs: 280,
                    xl: 320,
                },
            }}
        />
        // </Link>
    );

    return (
        <Link href={`/dashboard/generation?image=${CoverUrl}`} >
        <MotionContainer action animate={active} sx={{ position: 'relative' }}>
            <Stack
                spacing={1}
                sx={{
                    p: 3,
                    width: 1,
                    bottom: 0,
                    zIndex: 9,
                    textAlign: 'left',
                    position: 'absolute',
                    color: 'common.white',
                }}
            >
                <m.div variants={varFade().inRight}>
                    <Typography variant="overline" sx={{ color: 'primary.light' }}>
                        {t('analytics.latest-images')}
                    </Typography>
                </m.div>

                <m.div variants={varFade().inRight}>
                    
                        <Typography variant="h5" noWrap>
                            {Title}
                        </Typography>
                    
                </m.div>

                <m.div variants={varFade().inRight}>
                    <Typography variant="body2" noWrap>
                        {Description}
                    </Typography>
                </m.div>
                
            </Stack>

            {renderImg}
            
        </MotionContainer>
        
        </Link>
    );
}