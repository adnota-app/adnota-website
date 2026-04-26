

todo:
- mobile: the hero browser mockup (900px, animated) breaks under the 768px breakpoint. Needs a scaled-down variant, a transform-based shrink, or a swap to a static annotated screenshot. Currently unusable on phones.

- Open Graph image is missing AND the paths disagree.                                                                                      
    - public/og-image.png does not exist on disk (I checked — only favicon svg).                                                              
    - og:image points to /og-image.png (line 20).                                                                                             
    - twitter:image points to /uploads/og-image.png (line 29).                                                                                
    - Your own TODO at line 19 says "drop a 1200×630 PNG at uploads/og-image.png".                                                            
  So: every link share to Slack, iMessage, Twitter, LinkedIn on launch day will show nothing or a broken image. This is the single            
  highest-leverage launch-day fix. Even a screenshot of the hero with the H1 baked in is enough. 

- Mobile nav vanishes entirely. Per your README, nav links are hidden on mobile with no hamburger. That means no nav, no "Get Early Access" CTA, nothing — on the device where most launch-day traffic lands (Twitter, Reddit, HN are mobile-heavy). At minimum, keep the nav-cta button visible on mobile. 
 

IMAGE PREVIEW FOR SHARING TODO:
⏺ Done. Here's what's now in place and what you still need to do.
                                                                                                                                  
  What I added                                                                                                                                
                                                                                                                                              
  - <meta name="description"> — 146 chars, pulled from your hero sub. Shows under the title in Google results and as the body of social       
  previews when no image loads.                                                                                                               
  - favicon.svg — inline SVG matching your brand purple→magenta gradient with a white "A". Modern browsers (Chrome, Edge, Firefox, Safari 16+)
   render SVG favicons natively. No binary needed.                                                                                            
  - Open Graph tags — og:type, og:url, og:title, og:description, og:image (+ width/height/alt). Slack, iMessage, LinkedIn, Discord, Facebook
  all read these.                                                                                                                             
  - Twitter Card tags — twitter:card="summary_large_image" triggers the big-image preview rather than the small thumbnail variant.          
  - <link rel="canonical"> — tells search engines the authoritative URL, avoids duplicate-content issues if the page is ever indexed via      
  different paths.                                                                                                                            
  - <meta name="theme-color"> — sets the mobile browser UI chrome to your #08080f background so the address bar blends with the page on iOS   
  Safari and Chrome Android.                                                                                                                  
                                                                                                                                            
  What only you can do                                                                                                                        
                                                                                                                                            
  There are two TODO comments in the head pointing at these:                                                                                  
  
  1. Set the production domain. Currently every absolute URL says https://adnota.app/ as a placeholder. Once your domain is final,find/replace that one string. Affects: og:url, og:image, twitter:image, canonical. Absolute URLs are required by Facebook/LinkedIn/Twitter — they won't follow relative paths.
  2. Create uploads/og-image.png at 1200×630 (the universally-supported size for summary_large_image on Twitter and the OG default for FB/LinkedIn/Slack). Suggested content: your hero h1 ("Annotate the web.") with a snapshot of the demo browser mockup beside it, on the dark background. Keep important text in the middle 1200×600 area — Twitter sometimes crops the top/bottom 15px. Until that file exists, link previews will show only the title + description (which is still much better than today's nothing).                                          
                  
  How to verify it's working                                                                                                                  
   
  Once you ship and have the image in place:                                                                                                  
                  
  - Facebook/LinkedIn/iMessage/Slack — paste your URL into Facebook's Sharing Debugger. It'll show exactly what the preview will look like and warn on missing tags.
  - Twitter/X — Twitter killed their public Card Validator, but pasting the URL into a draft tweet shows the same render the live preview will use.
  - Google search snippet — use Google's Rich Results Test.


done:
- breaking into separate files
- update readme with implementation details
- update BROWSER MOCKUP to match actual extension (real dock, ported selection overlays, sequenced tool demo + captions)

- No pricing answer anywhere. Free? Freemium? Paid later? On a launch page, this is the second question every visitor asks (after "what is it"). Add a one-line answer somewhere visible — even "Free during beta" closes the loop. 

- No social proof anywhere — no founder note, no "I built this because…", no quotes from any beta user, no Product Hunt badge. For a launch-day pre-Web-Store product, the founder story is your social proof. One paragraph somewhere ("I was tired of…") is worth more than another feature card.   

- Emoji icons (🔒 ⚡ 🎨 🔐 ☁️  👁) clash with the polished CSS-art feature cards. Your feature cards punch above their weight; the emoji pillars look like a placeholder next to them. SVG icons in --accent would unify the brand.

- SEO title is brand-first. Try "Adnota — Annotate, Highlight & Erase Any Webpage · Chrome Extension" to capture intent searches. 

- Footer needs Privacy Policy + Terms + Contact links. Chrome Web Store often requires a privacy policy URL anyway. 

- ~~No FAQ. "Will it work on [bank/SPA/iframe]?", "What if I uninstall?", "Does it sync between my devices?" — these are the questions that block the install. ~~