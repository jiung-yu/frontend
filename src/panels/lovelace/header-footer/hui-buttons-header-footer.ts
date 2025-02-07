import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import { computeDomain } from "../../../common/entity/compute_domain";
import { HomeAssistant } from "../../../types";
import { processConfigEntities } from "../common/process-config-entities";
import "../components/hui-buttons-base";
import { EntityConfig } from "../entity-rows/types";
import { LovelaceHeaderFooter } from "../types";
import { ButtonsHeaderFooterConfig } from "./types";

@customElement("hui-buttons-header-footer")
export class HuiButtonsHeaderFooter
  extends LitElement
  implements LovelaceHeaderFooter
{
  public static getStubConfig(): Record<string, unknown> {
    return { entities: [] };
  }

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _configEntities?: EntityConfig[];

  public getCardSize(): number {
    return 3;
  }

  public setConfig(config: ButtonsHeaderFooterConfig): void {
    this._configEntities = processConfigEntities(config.entities).map(
      (entityConfig) => {
        const conf = {
          tap_action: { action: "toggle" },
          hold_action: { action: "more-info" },
          ...entityConfig,
        };
        if (computeDomain(entityConfig.entity) === "scene") {
          conf.tap_action = {
            action: "call-service",
            service: "scene.turn_on",
            target: { entity_id: conf.entity },
          };
        }
        return conf;
      }
    );
  }

  protected render(): TemplateResult | void {
    return html`
      <hui-buttons-base
        .hass=${this.hass}
        .configEntities=${this._configEntities}
      ></hui-buttons-base>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-buttons-header-footer": HuiButtonsHeaderFooter;
  }
}
