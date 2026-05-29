const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83372.6430083575!2d0.864378462609433!3d49.230998034777734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e11b950bf2cf35%3A0x4ca98baf7096dd88!2sKarine%20Beaut%C3%A9%20Zen!5e0!3m2!1sfr!2sfr!4v1780061909709!5m2!1sfr!2sfr";

export default function Map() {
  return (
    <iframe
      src={MAP_EMBED_URL}
      className="w-full h-full rounded-xl border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Karine Beauté Zen - Localisation"
    />
  );
}
