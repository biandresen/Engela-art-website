export type DeployContext =
  | 'production'
  | 'deploy-preview'
  | 'branch-deploy'
  | 'dev'
  | 'unknown'

export type IntegrationMode = 'safe' | 'production'

type IntegrationRuntime = {
  deployContext: DeployContext
  requestedMode: IntegrationMode
}

/**
 * Production integrations require two independent signals. Any preview, local,
 * test, or unknown context remains safe even if its mode is misconfigured.
 */
export function resolveIntegrationMode({
  deployContext,
  requestedMode,
}: IntegrationRuntime): IntegrationMode {
  return deployContext === 'production' && requestedMode === 'production'
    ? 'production'
    : 'safe'
}
