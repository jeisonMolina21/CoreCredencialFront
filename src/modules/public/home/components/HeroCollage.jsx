import React from 'react';
import { motion as Motion } from 'framer-motion';
import styles from '../home.module.css';

// Import images
import admin1 from '../../../../assets/collage/admin1.png';
import carnet1 from '../../../../assets/collage/carnet1.png';
import carnet2 from '../../../../assets/collage/carnet2.png';
import dashboard1 from '../../../../assets/collage/dashboard1.png';
import dashboard2 from '../../../../assets/collage/dashboard2.png';
import idCard1 from '../../../../assets/collage/id_card1.png';
import mobile1 from '../../../../assets/collage/mobile1.png';
import security1 from '../../../../assets/collage/security1.png';
import success1 from '../../../../assets/collage/success1.png';
import visitor1 from '../../../../assets/collage/visitor1.png';

const MarqueeRow = ({ images, direction = 'right', speed = 50 }) => {
  // Triple the images for a perfect seamless loop
  const duplicatedImages = [...images, ...images, ...images];
  
  const isRight = direction === 'right';
  
  // Animation logic:
  // Since we have 3 identical sets, moving -33.33% (or from -33.33% to 0) 
  // will perfectly align the start of the next set with the current view.
  const animate = {
    x: isRight ? ["-33.333%", "0%"] : ["0%", "-33.333%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    },
  };

  return (
    <div className={styles.collageRowWrapper}>
      <Motion.div 
        className={styles.collageRow} 
        animate={animate}
        initial={false}
      >
        {duplicatedImages.map((img, i) => (
          <div key={`${img}-${i}`} className={styles.bgCollageImgWrapper}>
            <img src={img} className={styles.bgCollageImg} alt="" loading="lazy" />
          </div>
        ))}
      </Motion.div>
    </div>
  );
};

const HeroCollage = () => {
  const row1 = [carnet1, dashboard1, mobile1, security1];
  const row2 = [success1, visitor1, admin1, carnet2];
  const row3 = [idCard1, dashboard2, carnet1, mobile1];

  return (
    <div className={styles.backgroundCollage}>
      <div className={styles.collageOverlay}></div>
      <div className={styles.collageTracks}>
        <MarqueeRow images={row1} direction="right" speed={40} />
        <MarqueeRow images={row2} direction="left" speed={50} />
        <MarqueeRow images={row3} direction="right" speed={45} />
      </div>
    </div>
  );
};

export default HeroCollage;
