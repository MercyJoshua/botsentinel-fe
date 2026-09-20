export const Footer = () => {
  return (
    <footer id="documentation">
      <div>
        <b>BotSentinel Telemetry</b>
        <small>
          © 2026 BotSentinel Systems · SentinelML Engine v2.4.1 · Average Inference: 14ms
          <br />
          Compliant with Open Threat Intelligence &amp; Zero-Trust Telemetry Standards.
        </small>
      </div>
      <nav>
        <a href="#architecture">Architecture Brief</a>
        <a href="#model-card">Model Card</a>
        <a id="api" href="#api">API Spec</a>
        <a href="#compliance">Security &amp; Compliance</a>
        <a href="#docs">Documentation</a>
      </nav>
    </footer>
  );
};