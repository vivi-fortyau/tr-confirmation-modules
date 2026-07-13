/* @jsx React.createElement */

const TWEAK_DEFAULTS = {
  logos: "off",        // logo section off until launch logos land
  testimonials: "1",   // 1 = dark blue · 2/3 = white, orange shadow, clickable
  secondBtn: "off",    // Module 01 second button (for "other pages")
  ctaSub: "on",        // Closing CTA subheading
  ctaSpace: "normal"   // Closing CTA spacing
};

function applyTweaks(t) {
  const b = document.body;
  b.dataset.logos = t.logos;
  b.dataset.tst = t.testimonials;
  b.dataset.secondBtn = t.secondBtn;
  b.dataset.ctaSub = t.ctaSub;
  b.dataset.ctaSpace = t.ctaSpace;
  // logo section is hidden by default, so its reveal observer may never fire —
  // snap the logos visible whenever it's switched on.
  if (t.logos === 'on') {
    document.querySelectorAll('#mod-logos .tr-logo').forEach(el => el.classList.add('is-visible'));
  }
}

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); },
    [t.logos, t.testimonials, t.secondBtn, t.ctaSub, t.ctaSpace]);

  return (
    <TweaksPanel>
      <TweakSection label="Logos" />
      <TweakToggle
        label="Logo section"
        value={t.logos === 'on'}
        onChange={(v) => setTweak('logos', v ? 'on' : 'off')}
      />

      <TweakSection label="Testimonials" />
      <TweakRadio
        label="How many"
        value={t.testimonials}
        options={[
          { value: '1', label: '1 · dark' },
          { value: '2', label: '2 · white' },
          { value: '3', label: '3 · white' }
        ]}
        onChange={(v) => setTweak('testimonials', v)}
      />

      <TweakSection label="Module 01" />
      <TweakToggle
        label="Second button"
        value={t.secondBtn === 'on'}
        onChange={(v) => setTweak('secondBtn', v ? 'on' : 'off')}
      />

      <TweakSection label="Closing CTA" />
      <TweakToggle
        label="Subheading"
        value={t.ctaSub === 'on'}
        onChange={(v) => setTweak('ctaSub', v ? 'on' : 'off')}
      />
      <TweakRadio
        label="Spacing"
        value={t.ctaSpace}
        options={['normal', 'compact']}
        onChange={(v) => setTweak('ctaSpace', v)}
      />

      <TweakSection label="Animations" />
      <TweakButton
        label="Replay"
        onClick={() => {
          ['Network', 'Chain', 'Compression', 'Bulk', 'Signer'].forEach(k => {
            const m = window[k + 'Module'];
            if (m && m.play) m.play();
          });
        }}
      >Replay every module</TweakButton>
    </TweaksPanel>
  );
}

applyTweaks(TWEAK_DEFAULTS);

const tweaksMount = document.getElementById('tweaks-mount');
if (tweaksMount) {
  ReactDOM.createRoot(tweaksMount).render(<Tweaks />);
}
