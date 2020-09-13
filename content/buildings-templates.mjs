
export const Templates = [
// 1
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 16;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 6 / 1 / span 20 / span 20;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -300px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 7 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 2
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 10;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 7 / 1 / span 20 / span 20;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -300px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 9 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 3
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 10;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 8 / 1 / span 20 / span 15;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -200px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 8 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 4
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 8;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 8; align-self: end; margin-top: 80px;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 9 / 1 / span 10 / span 13;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -70px;"></video>
      </div>
      <div class="lead text_large" style="grid-area: 16 / 4 / span 2 / span 8;">${content.lead}</div>
      <div class="row detail-text" style="grid-area: 4 / 12 / span 10 / span 6;">
        ${content.text}
      </div>
    </div>
  `,
// 5
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 10;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 7 / 1 / span 20 / span 20;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -300px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 8 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 6
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 8;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end; transform: translateY(140px);" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 7 / 1 / span 20 / span 15;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -200px;"></video>
      </div>
      <div class="lead text_large" style="grid-area: 16 / 4 / span 2 / span 8;">${content.lead}</div>
      <div class="row detail-text" style="grid-area: 4 / 12 / span 10 / span 6;">
        ${content.text}
      </div>
    </div>
  `,
// 7
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 8;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end; transform: translateY(140px);" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 8 / 1 / span 20 / span 15;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -200px;"></video>
      </div>
      <div class="lead text_large" style="grid-area: 16 / 4 / span 2 / span 8;">${content.lead}</div>
      <div class="row detail-text" style="grid-area: 4 / 12 / span 10 / span 6;">
        ${content.text}
      </div>
    </div>
  `,
// 8
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 8;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end; transform: translateY(140px);" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 8 / 1 / span 20 / span 15;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -200px;"></video>
      </div>
      <div class="lead text_large" style="grid-area: 16 / 4 / span 2 / span 8;">${content.lead}</div>
      <div class="row detail-text" style="grid-area: 4 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 9
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 6;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 7 / 1 / span 20 / span 16;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -200px;"></video>
      </div>
      <div class="lead text_large" style="grid-area: 16 / 4 / span 2 / span 8;">${content.lead}</div>
      <div class="row detail-text" style="grid-area: 4 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 10
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 15;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 8; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 8 / 1 / span 20 / span 17;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -250px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 6 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
// 11
(content) => `
    <div class="container detail-container golden-grid">
      <h2 style="grid-area: 4 / 4 / span 2 / span 10;">${content.title}</h2>
      <h3 style="grid-area: 5 / 4 / span 1 / span 10; align-self: end;" class="subtitle">${content.subtitle}</h3>
      <div class="detail-video-container" style="grid-area: 6 / 1 / span 20 / span 20;">

        <video src="${content.image}" type="video/mp4" autoplay muted loop style="margin-left: -400px;"></video>
      </div>
      <div class="row detail-text" style="grid-area: 8 / 13 / span 10 / span 5;">
        ${content.text}
      </div>
    </div>
  `,
]
