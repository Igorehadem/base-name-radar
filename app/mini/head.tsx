export default function Head() {
  return (
    <>
      {/* Разрешаем встраивание страницы внутрь Warpcast */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="frame-ancestors https://warpcast.com https://*.warpcast.com;"
      />

      {/* Указываем, что страница разрешена как Mini App */}
      <meta name="fc:frame-allowed" content="true" />

      {/* Дополнительно указываем название приложения */}
      <meta name="fc:frame-title" content="Base Name Radar" />

      {/* Можно добавить иконку */}
      <meta
        name="fc:frame-image"
        content="https://igoreha.online/icon.png"
      />
    </>
  );
}
