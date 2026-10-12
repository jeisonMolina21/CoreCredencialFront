import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { bannerService } from '../../../system/parameters';
import styles from './HeroBanner.module.css';

const HeroBanner = ({ data = null, customHeight = null, autoPlay = true }) => {
    const [banners, setBanners] = useState(data || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(!data);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (data) {
            setBanners(data);
            setLoading(false);
            return;
        }

        const fetchBanners = async () => {
            try {
                const response = await bannerService.getActiveBanners();
                // Manejo defensivo: si el interceptor no lo hizo, lo hacemos aquí
                const bannersData = response.data || response;
                setBanners(Array.isArray(bannersData) ? bannersData : []);
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [data]);

    useEffect(() => {
        if (autoPlay && banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 8000); // <--- AQUÍ CAMBIAS EL TIEMPO (6000ms = 6 segundos)
            return () => clearInterval(timer);
        }
    }, [banners, autoPlay]);

    if (loading || banners.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <section className={styles.bannerContainer} style={customHeight ? { height: customHeight, aspectRatio: 'auto' } : {}}>
            <AnimatePresence>
                <Motion.div
                    key={banners[currentIndex]?.id || currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className={styles.slide}
                >
                    {banners[currentIndex]?.link_url ? (
                        <a href={banners[currentIndex].link_url} className={styles.bannerLink}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={banners[currentIndex].image_url?.startsWith('blob:') ? banners[currentIndex].image_url : `${API_URL}${banners[currentIndex].image_url}`}
                                    alt={banners[currentIndex].title}
                                    className={styles.image}
                                />
                            </div>
                        </a>
                    ) : (
                        <div className={styles.imageWrapper}>
                            <img
                                src={banners[currentIndex]?.image_url ? (banners[currentIndex].image_url.startsWith('blob:') ? banners[currentIndex].image_url : `${API_URL}${banners[currentIndex].image_url}`) : ''}
                                alt={banners[currentIndex]?.title || 'Banner'}
                                className={styles.image}
                            />
                        </div>
                    )}
                </Motion.div>
            </AnimatePresence>

            {banners.length > 1 && (
                <>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>
                        <ChevronRight size={24} />
                    </button>

                    <div className={styles.indicators}>
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default HeroBanner;
