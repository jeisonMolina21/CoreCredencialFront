import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import styles from './Blog.module.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "La importancia de la seguridad biométrica en 2026",
      excerpt: "Descubre cómo las nuevas tecnologías de reconocimiento facial están transformando el acceso físico en las empresas modernas.",
      author: "Ana Martínez",
      date: "Oct 15, 2026",
      category: "Seguridad",
      color: "#3b82f6"
    },
    {
      id: 2,
      title: "Automatización de RRHH: Menos papeleo, más gente",
      excerpt: "La gestión de carnets es solo el principio. Hablamos de cómo la digitalización libera tiempo valioso para tu equipo de talento.",
      author: "Carlos Ruiz",
      date: "Oct 12, 2026",
      category: "Innovación",
      color: "#10b981"
    },
    {
      id: 3,
      title: "Control de Acceso Multi-Sede simplificado",
      excerpt: "Estrategias efectivas para gestionar múltiples ubicaciones desde un solo panel de control centralizado y seguro.",
      author: "Elena Gómez",
      date: "Oct 08, 2026",
      category: "Gestión",
      color: "#8b5cf6"
    },
    {
      id: 4,
      title: "El futuro de las credenciales digitales",
      excerpt: "¿Estamos ante el fin de los carnets físicos? Analizamos las tendencias que marcarán el próximo lustro en identificación.",
      author: "David Soto",
      date: "Oct 05, 2026",
      category: "Tendencias",
      color: "#f59e0b"
    }
  ];

  const categories = ["Todos", "Seguridad", "Innovación", "Gestión", "Tendencias"];

  return (
    <div className={styles.blogPage}>
      {/* Header / Hero */}
      <section className={styles.blogHero}>
        <div className="container">
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <span className={styles.subtitle}>Nuestro Blog</span>
            <h1 className={styles.title}>Innovación en <span className={styles.accent}>Identidad Digital</span></h1>
            <p className={styles.description}>
              Explora las últimas tendencias, guías y casos de éxito sobre seguridad corporativa y gestión de talento humano.
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.blogContent}>
        <div className="container">
          <div className={styles.blogLayout}>
            {/* Sidebar / Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.searchBox}>
                <Search size={20} className={styles.searchIcon} />
                <input type="text" placeholder="Buscar artículos..." className={styles.searchInput} />
              </div>

              <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>Categorías</h3>
                <div className={styles.categoryList}>
                  {categories.map(cat => (
                    <button key={cat} className={`${styles.categoryItem} ${cat === 'Todos' ? styles.active : ''}`}>
                      <Tag size={16} />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className={styles.postsGrid}>
              {blogPosts.map((post, index) => (
                <Motion.article 
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${styles.postCard} glass-card`}
                >
                  <div 
                    className={styles.postImagePlaceholder} 
                    style={{ background: `linear-gradient(135deg, ${post.color} 0%, #1e293b 100%)` }}
                  >
                    <span className={styles.categoryBadge}>{post.category}</span>
                  </div>
                  
                  <div className={styles.postInfo}>
                    <div className={styles.postMeta}>
                      <span><Calendar size={14} /> {post.date}</span>
                      <span><User size={14} /> {post.author}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <button className={styles.readMore}>
                      Leer Artículo <ArrowRight size={16} />
                    </button>
                  </div>
                </Motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
