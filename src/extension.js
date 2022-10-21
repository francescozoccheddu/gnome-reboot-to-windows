const misc = imports.misc;
const gi = imports.gi;
const ui = imports.ui;

const uuid = misc.extensionUtils.getCurrentExtension().metadata.uuid;
const getText = imports.gettext.domain(uuid).gettext;

class Extension {

  #menu;
  #menuItem;
  #dialog;
  #rebootIntervalId;
  #dialogMessageIntervalId;

  constructor() {
    this.#menu = ui.main.panel.statusArea.quickSettings._system.quickSettingsItems[0].menu;
  }

  enable() {
    const indent = "      ";
    const itemLabel = `${indent}${getText("Restart into Windows")}...`;
    this.#menuItem = new ui.popupMenu.PopupImageMenuItem(itemLabel, "");
    this.#menuItem.connect("activate", () => this.#requestReboot());
    this.#menu.addMenuItem(this.#menuItem, 2);
  }

  disable() {
    this.#cancelRebootRequest();
    this.#menuItem.destroy();
    this.#menuItem = null;
  }

  #requestReboot() {
    this.#cancelRebootRequest();
    const rebootDelay = 60;
    this.#dialog = new ui.modalDialog.ModalDialog({ styleClass: "modal-dialog" });
    this.#dialog.setButtons([
      {
        label: getText("Cancel"),
        action: () => this.#cancelRebootRequest(),
        key: gi.Clutter.KEY_Escape,
        default: false,
      },
      {
        label: getText("Restart"),
        action: () => this.#reboot(),
        default: false,
      },
    ]);
    function getDialogMessageText(remainingTime) {
      if (remainingTime > 10) {
        remainingTime = Math.ceil(remainingTime / 10) * 10;
      }
      return getText(`The system will restart automatically in % seconds.`).replace("%", Math.max(Math.ceil(remainingTime), 0));
    }
    const dialogMessage = new gi.St.Label({
      text: getDialogMessageText(rebootDelay)
    });
    dialogMessage.clutter_text.ellipsize = gi.Pango.EllipsizeMode.NONE;
    dialogMessage.clutter_text.line_wrap = true;
    const dialogTitleBox = new gi.St.BoxLayout({
      x_align: gi.Clutter.ActorAlign.CENTER,
    });
    dialogTitleBox.add(new gi.St.Label({ text: "  " }));
    dialogTitleBox.add(new gi.St.Label({
      text: getText("Restart to Windows"),
      //style_class: "dialog-title" // FIXME
      style: "font-weight: bold; font-size:18px"
    }));
    const dialogBox = new gi.St.BoxLayout({ y_expand: true, vertical: true });
    dialogBox.add(dialogTitleBox);
    dialogBox.add(new gi.St.Label({ text: "  " }));
    dialogBox.add(dialogMessage);
    this.#dialog.contentLayout.add(dialogBox);
    this.#dialog.open();
    const countdownStartTime = new Date();
    this.#dialogMessageIntervalId = setInterval(() => {
      const elapsed = (new Date() - countdownStartTime) / 1000;
      dialogMessage.set_text(getDialogMessageText(rebootDelay - elapsed));
    }, 0.5 * 1000);
    this.#rebootIntervalId = setInterval(() => this.#reboot(), rebootDelay * 1000);
  }

  #cancelRebootRequest() {
    this.#dialog?.close();
    this.#dialog = null;
    if (this.#rebootIntervalId !== null) {
      clearInterval(this.#rebootIntervalId);
      this.#rebootIntervalId = null;
    }
    if (this.#dialogMessageIntervalId !== null) {
      clearInterval(this.#dialogMessageIntervalId);
      this.#dialogMessageIntervalId = null;
    }
  }

  #reboot() {
    this.#cancelRebootRequest();
    gi.GLib.spawn_command_line_async("%COMMAND%");
  }

}

function init() {
  misc.extensionUtils.initTranslations(uuid);
  return new Extension();
}
