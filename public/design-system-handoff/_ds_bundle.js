/* @ds-bundle: {"format":3,"namespace":"DesignSystem_a49d67","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"StatCard","sourcePath":"components/display/StatCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Eyebrow","sourcePath":"components/marketing/Eyebrow.jsx"},{"name":"StepPills","sourcePath":"components/marketing/StepPills.jsx"},{"name":"VehicleCard","sourcePath":"components/marketing/VehicleCard.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"01ea4116b79c","components/buttons/IconButton.jsx":"9c160c264e55","components/display/Avatar.jsx":"a483dab6aadb","components/display/Badge.jsx":"f487f6eacec4","components/display/Card.jsx":"88d905ed0eb2","components/display/StatCard.jsx":"334c34c8e926","components/forms/Checkbox.jsx":"c7aaf8eb907d","components/forms/Input.jsx":"9795a37bdb61","components/forms/Select.jsx":"82197aac7f2e","components/marketing/Eyebrow.jsx":"aa25072f9bdf","components/marketing/StepPills.jsx":"f6858d77fb01","components/marketing/VehicleCard.jsx":"93cb55941a2a","ui_kits/dealer-site/Chrome.jsx":"4e101214a5ad","ui_kits/dealer-site/Listing.jsx":"c500eefc3acf","ui_kits/dealer-site/VDP.jsx":"f0534d0e5de9","ui_kits/dealer-site/data.jsx":"56f36a5f2313","ui_kits/dealer-site/icons.jsx":"489de60ad8f7","ui_kits/marketing/DealerPreview.jsx":"00e058a615eb","ui_kits/marketing/Elevate.jsx":"dba9d473ec03","ui_kits/marketing/Header.jsx":"5078ca74d115","ui_kits/marketing/Layout.jsx":"1c1797682375","ui_kits/marketing/Pricing.jsx":"2c83662a1ff0","ui_kits/marketing/Reveal.jsx":"acd3c384a4af","ui_kits/marketing/Search.jsx":"73f2cfd5de1f","ui_kits/marketing/SectionsEnd.jsx":"d130f4682cef","ui_kits/marketing/SectionsMid.jsx":"e8c3a7b23aae","ui_kits/marketing/Testimonials.jsx":"ac81ea78ed5c","ui_kits/marketing/data.jsx":"def5b5780968","ui_kits/marketing/icons.jsx":"748d3ed6e9ce"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_a49d67 = window.DesignSystem_a49d67 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Button
 * Primary CTA uses cobalt with a colored lift shadow. Confident, slightly
 * tight tracking. Hover darkens + lifts 1px; active presses down.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const sizes = {
    sm: {
      padding: '0 14px',
      height: 36,
      fontSize: 'var(--text-sm)',
      gap: 7,
      radius: 'var(--radius-sm)'
    },
    md: {
      padding: '0 20px',
      height: 46,
      fontSize: 'var(--text-base)',
      gap: 9,
      radius: 'var(--radius-md)'
    },
    lg: {
      padding: '0 28px',
      height: 56,
      fontSize: 'var(--text-lg)',
      gap: 11,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      base: {
        background: 'var(--brand)',
        color: 'var(--text-on-ink-cta)',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-md)'
      },
      hover: {
        background: 'var(--brand-hover)'
      }
    },
    accent: {
      base: {
        background: 'var(--accent)',
        color: 'var(--cream-50)',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-md)'
      },
      hover: {
        background: 'var(--bronze-400)'
      }
    },
    secondary: {
      base: {
        background: 'var(--surface-card)',
        color: 'var(--text-strong)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xs)'
      },
      hover: {
        background: 'var(--cream-100)',
        borderColor: 'var(--border-strong)'
      }
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--text-strong)',
        border: '1px solid transparent',
        boxShadow: 'none'
      },
      hover: {
        background: 'var(--cream-300)'
      }
    },
    inverse: {
      base: {
        background: 'var(--cream-50)',
        color: 'var(--ink-900)',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-md)'
      },
      hover: {
        background: 'var(--cream-200)'
      }
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: s.fontSize,
      letterSpacing: 'var(--tracking-snug)',
      lineHeight: 1,
      borderRadius: s.radius,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
      transform: !disabled && press ? 'translateY(1px)' : !disabled && hover ? 'translateY(-1px)' : 'translateY(0)',
      transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...v.base,
      ...(hover && !disabled ? v.hover : {}),
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — IconButton
 * Square/circular control for a single glyph (nav, close, social).
 */
function IconButton({
  children,
  variant = 'secondary',
  size = 'md',
  rounded = false,
  disabled = false,
  'aria-label': ariaLabel,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const dims = {
    sm: 36,
    md: 44,
    lg: 52
  };
  const d = dims[size] || dims.md;
  const variants = {
    secondary: {
      base: {
        background: 'var(--surface-card)',
        color: 'var(--text-strong)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xs)'
      },
      hover: {
        background: 'var(--cream-100)',
        borderColor: 'var(--border-strong)'
      }
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--text-body)',
        border: '1px solid transparent',
        boxShadow: 'none'
      },
      hover: {
        background: 'var(--cream-300)',
        color: 'var(--text-strong)'
      }
    },
    solid: {
      base: {
        background: 'var(--brand)',
        color: 'var(--cream-50)',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-md)'
      },
      hover: {
        background: 'var(--brand-hover)'
      }
    },
    inverse: {
      base: {
        background: 'rgba(255,253,247,0.08)',
        color: 'var(--cream-50)',
        border: '1px solid var(--border-inverse)',
        boxShadow: 'none'
      },
      hover: {
        background: 'rgba(255,253,247,0.16)'
      }
    }
  };
  const v = variants[variant] || variants.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      flex: 'none',
      borderRadius: rounded ? 'var(--radius-full)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transform: !disabled && press ? 'translateY(1px)' : !disabled && hover ? 'translateY(-1px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...v.base,
      ...(hover && !disabled ? v.hover : {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
/**
 * DealerSite Pro — Avatar
 * Round image or initials. Used in testimonials and lead notifications.
 */
function Avatar({
  src,
  name = '',
  size = 44,
  style = {}
}) {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: 'none',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'var(--cream-300)',
      border: '1px solid var(--border-default)',
      color: 'var(--stone-700)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: Math.round(size * 0.36),
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Badge
 * Small status / category pill. Default is a calm outlined chip; `solid`
 * inverts to ink; `accent` uses warm bronze. Use `dot` for a status point.
 */
function Badge({
  children,
  variant = 'outline',
  size = 'md',
  dot = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: 'var(--text-xs)',
      padding: '3px 9px',
      gap: 6
    },
    md: {
      fontSize: 'var(--text-sm)',
      padding: '5px 12px',
      gap: 7
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    outline: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-default)'
    },
    soft: {
      background: 'var(--cream-300)',
      color: 'var(--stone-700)',
      border: '1px solid transparent'
    },
    solid: {
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      border: '1px solid transparent'
    },
    accent: {
      background: 'rgba(168,121,58,0.12)',
      color: 'var(--bronze-500)',
      border: '1px solid rgba(168,121,58,0.25)'
    },
    success: {
      background: 'rgba(46,139,90,0.12)',
      color: 'var(--green-500)',
      border: '1px solid rgba(46,139,90,0.25)'
    }
  };
  const v = variants[variant] || variants.outline;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      padding: s.padding,
      fontFamily: 'var(--font-body)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-snug)',
      lineHeight: 1,
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor',
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Card
 * Warm surface container. `tone` switches between cream card, plain white,
 * and dark (for use on the ink stage). `interactive` adds a hover lift.
 */
function Card({
  children,
  tone = 'card',
  padding = 'lg',
  interactive = false,
  radius = 'lg',
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)',
    xl: 'var(--space-10)'
  };
  const radii = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)'
  };
  const tones = {
    card: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-body)'
    },
    warm: {
      background: 'var(--surface-card-warm)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-body)'
    },
    plain: {
      background: 'var(--white)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-body)'
    },
    dark: {
      background: 'var(--surface-dark)',
      border: '1px solid var(--border-inverse)',
      color: 'var(--text-on-dark-muted)',
      boxShadow: 'var(--shadow-inset-dark)'
    }
  };
  const t = tones[tone] || tones.card;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      borderRadius: radii[radius] || radii.lg,
      padding: pads[padding] ?? pads.lg,
      boxShadow: hover ? 'var(--shadow-lg)' : t.boxShadow || 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/StatCard.jsx
try { (() => {
/**
 * DealerSite Pro — StatCard
 * Big editorial metric with label. Used in proof strips ("2,400+ enquiries").
 * `tone="dark"` for use on the ink stage. `align` controls text alignment.
 */
function StatCard({
  value,
  label,
  sublabel,
  tone = 'plain',
  align = 'left',
  style = {}
}) {
  const isDark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-extrabold)',
      fontSize: 'var(--text-4xl)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1,
      color: isDark ? 'var(--cream-50)' : 'var(--text-strong)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-base)',
      color: isDark ? 'var(--cream-50)' : 'var(--text-strong)',
      marginTop: 4
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: isDark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, sublabel));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Checkbox
 * Custom box with ink fill when checked. Pairs label inline.
 */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const reactId = React.useId ? React.useId() : undefined;
  const fieldId = id || reactId;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isChecked = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: isControlled ? undefined : defaultChecked,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 20,
      height: 20,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${isChecked ? 'var(--ink-900)' : 'var(--border-strong)'}`,
      background: isChecked ? 'var(--ink-900)' : 'var(--surface-card)',
      color: 'var(--cream-50)',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, isChecked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L4.8 8.5L9.5 3.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Input
 * Text field on warm card surface. Calm border, ink focus ring. Optional
 * label, hint, error, and leading/trailing adornments.
 */
function Input({
  label,
  hint,
  error,
  id,
  type = 'text',
  size = 'md',
  iconLeft = null,
  trailing = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId ? React.useId() : undefined;
  const fieldId = id || reactId;
  const sizes = {
    sm: {
      height: 40,
      fontSize: 'var(--text-sm)',
      pad: 12
    },
    md: {
      height: 48,
      fontSize: 'var(--text-base)',
      pad: 14
    },
    lg: {
      height: 56,
      fontSize: 'var(--text-lg)',
      pad: 16
    }
  };
  const s = sizes[size] || sizes.md;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--ink-700)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: s.height,
      padding: `0 ${s.pad}px`,
      background: disabled ? 'var(--cream-200)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? `0 0 0 var(--ring-width) var(--ring-color)` : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.6 : 1
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-faint)',
      flex: 'none'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-strong)'
    }
  }, rest)), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-muted)',
      flex: 'none'
    }
  }, trailing)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DealerSite Pro — Select
 * Native select styled to match Input, with a chevron adornment.
 */
function Select({
  label,
  hint,
  error,
  id,
  size = 'md',
  options = [],
  placeholder,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId ? React.useId() : undefined;
  const fieldId = id || reactId;
  const sizes = {
    sm: {
      height: 40,
      fontSize: 'var(--text-sm)',
      pad: 12
    },
    md: {
      height: 48,
      fontSize: 'var(--text-base)',
      pad: 14
    },
    lg: {
      height: 56,
      fontSize: 'var(--text-lg)',
      pad: 16
    }
  };
  const s = sizes[size] || sizes.md;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--ink-700)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: s.height,
      padding: `0 40px 0 ${s.pad}px`,
      appearance: 'none',
      WebkitAppearance: 'none',
      background: disabled ? 'var(--cream-200)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? `0 0 0 var(--ring-width) var(--ring-color)` : 'var(--shadow-xs)',
      fontFamily: 'var(--font-body)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-strong)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      opacity: disabled ? 0.6 : 1,
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 14,
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: 12
    }
  }, "\u25BE")), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Eyebrow.jsx
try { (() => {
/**
 * DealerSite Pro — Eyebrow
 * Uppercase, letter-spaced overline label that sits above section headings.
 * Optional leading tick mark. `tone="dark"` for ink sections.
 */
function Eyebrow({
  children,
  tone = 'light',
  tick = true,
  style = {}
}) {
  const color = tone === 'dark' ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      ...style
    }
  }, tick && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1.5,
      background: tone === 'dark' ? 'var(--bronze-400)' : 'var(--accent)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color
    }
  }, children));
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/marketing/StepPills.jsx
try { (() => {
/**
 * DealerSite Pro — StepPills
 * The signature 5-step setup wizard pill nav. Active step is ink/black,
 * others are light neutral. Numbered. On narrow widths it scrolls
 * horizontally. Used in the hero header and the "How it works" section.
 */
function StepPills({
  steps = ['Details', 'Vehicles', 'Style', 'Inventory', 'Go Live'],
  active = 0,
  numbered = true,
  onSelect,
  tone = 'light',
  style = {}
}) {
  const isDark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: 5,
      borderRadius: 'var(--radius-full)',
      background: isDark ? 'rgba(255,253,247,0.06)' : 'var(--surface-card)',
      border: `1px solid ${isDark ? 'var(--border-inverse)' : 'var(--border-default)'}`,
      boxShadow: isDark ? 'none' : 'var(--shadow-xs)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      maxWidth: '100%',
      ...style
    }
  }, steps.map((label, i) => {
    const isActive = i === active;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      type: "button",
      onClick: () => onSelect && onSelect(i),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flex: 'none',
        height: 38,
        padding: '0 16px',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        cursor: onSelect ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: 'var(--tracking-snug)',
        whiteSpace: 'nowrap',
        background: isActive ? 'var(--ink-900)' : 'transparent',
        color: isActive ? 'var(--cream-50)' : isDark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
      }
    }, numbered && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 19,
        height: 19,
        borderRadius: '50%',
        fontSize: 11,
        fontWeight: 'var(--weight-bold)',
        fontFamily: 'var(--font-mono)',
        background: isActive ? 'rgba(255,253,247,0.18)' : isDark ? 'rgba(255,253,247,0.1)' : 'var(--cream-300)',
        color: isActive ? 'var(--cream-50)' : 'inherit'
      }
    }, i + 1), label);
  }));
}
Object.assign(__ds_scope, { StepPills });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/StepPills.jsx", error: String((e && e.message) || e) }); }

// components/marketing/VehicleCard.jsx
try { (() => {
/**
 * DealerSite Pro — VehicleCard
 * Premium inventory card: photo, optional tag (New/Used/EV), name, price,
 * a compact spec row, and an Enquire CTA. Hover lifts the card and zooms
 * the photo slightly. Used across dealer-site previews and inventory grids.
 */
function VehicleCard({
  image,
  name = 'Vehicle',
  price,
  tag,
  specs = [],
  onEnquire,
  ctaLabel = 'Enquire',
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      overflow: 'hidden',
      background: 'var(--cream-300)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)'
    }
  }, "Vehicle photo"), tag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      padding: '4px 11px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-snug)'
    }
  }, tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-lg)',
      letterSpacing: 'var(--tracking-snug)',
      color: 'var(--text-strong)',
      lineHeight: 1.2
    }
  }, name), price && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-extrabold)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, price)), specs.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, specs.map(sp => /*#__PURE__*/React.createElement("span", {
    key: sp,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-muted)',
      background: 'var(--cream-200)',
      border: '1px solid var(--border-subtle)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)'
    }
  }, sp))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    fullWidth: true,
    onClick: onEnquire,
    style: {
      marginTop: 2
    }
  }, ctaLabel)));
}
Object.assign(__ds_scope, { VehicleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/VehicleCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dealer-site/Chrome.jsx
try { (() => {
// Sharma Motors — site chrome (header + footer).
function DealerHeader({
  onHome
}) {
  const D = window.DEALER;
  const {
    Button
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(255,253,247,0.86)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 28px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onHome,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 19
    }
  }, "S"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 19,
      letterSpacing: '-0.025em',
      color: 'var(--text-strong)'
    }
  }, D.name)), /*#__PURE__*/React.createElement("nav", {
    className: "ds-nav",
    style: {
      display: 'flex',
      gap: 26,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onHome,
    style: {
      cursor: 'pointer',
      color: 'var(--text-strong)'
    }
  }, "Inventory"), /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "Finance"), /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "About"), /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-phone",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.phone, {
    size: 16
  }), " ", D.phone), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Enquire"))));
}
function DealerFooter() {
  const D = window.DEALER;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-stage)',
      color: 'var(--cream-50)',
      padding: '56px 28px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-foot",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 28,
      paddingBottom: 32,
      borderBottom: '1px solid var(--border-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 20,
      marginBottom: 10
    }
  }, D.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text-on-dark-muted)'
    }
  }, D.city, ". Trusted multi-brand dealership for new, used, and electric vehicles.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.mapPin, {
    size: 16
  }), " ", D.city)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      paddingTop: 22,
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 ", D.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Built with ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--bronze-400)',
      fontWeight: 700
    }
  }, "DealerSite Pro")))));
}
Object.assign(window, {
  DealerHeader,
  DealerFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dealer-site/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dealer-site/Listing.jsx
try { (() => {
// Sharma Motors — inventory listing (homepage body): hero + filters + grid.
function DealerHero() {
  const D = window.DEALER;
  const {
    Button
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 460,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: D.hero,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(11,14,18,0.86) 0%, rgba(11,14,18,0.45) 60%, rgba(11,14,18,0.1) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1180,
      width: '100%',
      margin: '0 auto',
      padding: '64px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 13px',
      borderRadius: 999,
      background: 'rgba(255,253,247,0.12)',
      border: '1px solid rgba(255,253,247,0.18)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.04em',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(window.Icons.star, {
    size: 13,
    style: {
      color: 'var(--bronze-400)'
    }
  }), " 4.8 \xB7 320+ happy buyers"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
      lineHeight: 1.02,
      letterSpacing: '-0.035em',
      color: 'var(--cream-50)',
      textWrap: 'balance'
    }
  }, "Find your next vehicle in ", D.city.split(',')[0], "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 28px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.55,
      color: 'var(--text-on-dark-muted)',
      maxWidth: 460
    }
  }, "New, used, and electric \u2014 cars and bikes from brands you trust, with finance and test drives on request."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 18
    })
  }, "Browse inventory"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: 'var(--cream-50)'
    },
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.whatsapp, {
      size: 17
    })
  }, "WhatsApp us")))));
}
function Filters({
  active,
  setActive,
  count
}) {
  const D = window.DEALER;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, D.filters.map(f => {
    const on = f === active;
    return /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: () => setActive(f),
      style: {
        height: 40,
        padding: '0 18px',
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 700,
        border: `1px solid ${on ? 'var(--ink-900)' : 'var(--border-default)'}`,
        background: on ? 'var(--ink-900)' : 'var(--surface-card)',
        color: on ? 'var(--cream-50)' : 'var(--text-body)',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, f);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, count, " vehicles available"));
}
function Listing({
  onOpen
}) {
  const D = window.DEALER;
  const {
    VehicleCard
  } = window.DesignSystem_a49d67;
  const [filter, setFilter] = React.useState('All');
  const items = D.inventory.filter(v => filter === 'All' ? true : filter === 'Used' ? v.tag === 'Used' : v.type === filter);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DealerHero, null), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '56px 28px 72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Latest inventory"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '8px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-3xl)',
      letterSpacing: '-0.025em',
      color: 'var(--text-strong)'
    }
  }, "Available now")), /*#__PURE__*/React.createElement(Filters, {
    active: filter,
    setActive: setFilter,
    count: items.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 22
    }
  }, items.map(v => /*#__PURE__*/React.createElement(VehicleCard, {
    key: v.id,
    image: v.image,
    name: v.name,
    price: v.price,
    tag: v.tag,
    specs: [String(v.year), v.fuel, v.km],
    ctaLabel: "View details",
    onEnquire: () => onOpen(v.id)
  })))));
}
Object.assign(window, {
  Listing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dealer-site/Listing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dealer-site/VDP.jsx
try { (() => {
// Sharma Motors — vehicle detail page (VDP): gallery, specs, enquire form.
function SpecItem({
  icon,
  label,
  value
}) {
  const Icon = window.Icons[icon];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, value)));
}
function VDP({
  vehicle,
  onBack
}) {
  const {
    Button,
    Badge,
    Input,
    Select
  } = window.DesignSystem_a49d67;
  const [shot, setShot] = React.useState(0);
  const [sent, setSent] = React.useState(false);
  const gallery = vehicle.gallery && vehicle.gallery.length ? vehicle.gallery : [vehicle.image];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '28px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-muted)',
      padding: '8px 0',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      transform: 'rotate(180deg)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
    size: 16
  })), " Back to inventory"), /*#__PURE__*/React.createElement("div", {
    className: "ds-vdp",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.35fr 1fr',
      gap: 'clamp(28px, 4vw, 56px)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-md)',
      aspectRatio: '16/11',
      background: 'var(--cream-300)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: gallery[shot],
    alt: vehicle.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "solid"
  }, vehicle.tag))), gallery.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 14
    }
  }, gallery.map((g, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setShot(i),
    style: {
      width: 92,
      height: 64,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      padding: 0,
      cursor: 'pointer',
      border: `2px solid ${i === shot ? 'var(--ink-900)' : 'var(--border-default)'}`,
      background: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: g,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '36px 0 16px',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-xl)',
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, "Specifications"), /*#__PURE__*/React.createElement("div", {
    className: "ds-specs",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SpecItem, {
    icon: "gauge",
    label: "Year",
    value: vehicle.year
  }), /*#__PURE__*/React.createElement(SpecItem, {
    icon: "fuel",
    label: "Fuel",
    value: vehicle.fuel
  }), /*#__PURE__*/React.createElement(SpecItem, {
    icon: "testdrive",
    label: "Odometer",
    value: vehicle.km
  }), /*#__PURE__*/React.createElement(SpecItem, {
    icon: "car",
    label: "Transmission",
    value: vehicle.trans
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '28px 0 0',
      maxWidth: 620,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 1.65,
      color: 'var(--text-body)'
    }
  }, "A well-maintained ", vehicle.name, " available at ", window.DEALER.name, ". Inspected, serviced, and ready for a test drive. Finance and exchange options available \u2014 talk to our team to book a viewing today.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, vehicle.tag === 'Used' ? 'Pre-owned' : 'On-road price'), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '6px 0 4px',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'var(--text-2xl)',
      letterSpacing: '-0.025em',
      color: 'var(--text-strong)'
    }
  }, vehicle.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'var(--text-3xl)',
      color: 'var(--text-strong)',
      marginBottom: 20
    }
  }, vehicle.price), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12,
      padding: '24px 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(46,139,90,0.12)',
      color: 'var(--success)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.check, {
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)'
    }
  }, "Enquiry sent!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, window.DEALER.name, " will call you back shortly."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => setSent(false)
  }, "Send another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Your name",
    placeholder: "e.g. Rohit Sharma",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Phone",
    type: "tel",
    placeholder: "+91",
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.phone, {
      size: 15
    }),
    required: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "I'm interested in",
    options: ['A test drive', 'Price & finance', 'Exchange my vehicle', 'A call back']
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    fullWidth: true,
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 17
    })
  }, "Send enquiry"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.whatsapp, {
      size: 16
    })
  }, "WhatsApp"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.phone, {
      size: 15
    })
  }, "Call")))))));
}
window.VDP = VDP;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dealer-site/VDP.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dealer-site/data.jsx
try { (() => {
// Sharma Motors — example dealer inventory (the site DealerSite Pro produces).
const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
window.DEALER = {
  name: 'Sharma Motors',
  city: 'Pune, Maharashtra',
  phone: '+91 98220 14785',
  domain: 'sharmamotors.in',
  hero: U('1503376780353-7e6692767b70', 1600),
  inventory: [{
    id: 'creta',
    name: 'Hyundai Creta SX (O)',
    price: '₹14.9 L',
    tag: 'New',
    type: 'Cars',
    year: 2024,
    fuel: 'Petrol',
    km: '0 km',
    trans: 'Automatic',
    image: U('1552519507-da3b142c6e3d'),
    gallery: [U('1552519507-da3b142c6e3d'), U('1492144534655-ae79c964c9d7'), U('1503736334956-4c8f8e92946d')]
  }, {
    id: 'swift',
    name: 'Maruti Swift VXi',
    price: '₹6.25 L',
    tag: 'Used',
    type: 'Cars',
    year: 2022,
    fuel: 'Petrol',
    km: '18,500 km',
    trans: 'Manual',
    image: U('1549924231-f129b911e442'),
    gallery: [U('1549924231-f129b911e442'), U('1605559424843-9e4c228bf1c2')]
  }, {
    id: 'mustang',
    name: 'Ford Mustang GT',
    price: '₹68.0 L',
    tag: 'Premium',
    type: 'Cars',
    year: 2021,
    fuel: 'Petrol',
    km: '9,200 km',
    trans: 'Automatic',
    image: U('1494976388531-d1058494cdd8'),
    gallery: [U('1494976388531-d1058494cdd8')]
  }, {
    id: 'nexon',
    name: 'Tata Nexon EV Max',
    price: '₹16.4 L',
    tag: 'EV',
    type: 'EV',
    year: 2024,
    fuel: 'Electric',
    km: '465 km range',
    trans: 'Automatic',
    image: U('1568605117036-5fe5e7bab0b7'),
    gallery: [U('1568605117036-5fe5e7bab0b7')]
  }, {
    id: 'classic',
    name: 'Royal Enfield Classic',
    price: '₹2.10 L',
    tag: 'New',
    type: 'Bikes',
    year: 2024,
    fuel: 'Petrol',
    km: '0 km',
    trans: '350cc',
    image: U('1568772585407-9361f9bf3a87'),
    gallery: [U('1568772585407-9361f9bf3a87')]
  }, {
    id: 'ola',
    name: 'Ola S1 Pro',
    price: '₹1.30 L',
    tag: 'EV',
    type: 'Bikes',
    year: 2024,
    fuel: 'Electric',
    km: '195 km range',
    trans: 'Scooter',
    image: U('1558981403-c5f9899a28bc'),
    gallery: [U('1558981403-c5f9899a28bc')]
  }, {
    id: 'fortuner',
    name: 'Toyota Fortuner 4x4',
    price: '₹42.5 L',
    tag: 'Used',
    type: 'Cars',
    year: 2023,
    fuel: 'Diesel',
    km: '12,400 km',
    trans: 'Automatic',
    image: U('1519641471654-76ce0107ad1b'),
    gallery: [U('1519641471654-76ce0107ad1b')]
  }, {
    id: 'thar',
    name: 'Mahindra Thar LX',
    price: '₹15.2 L',
    tag: 'New',
    type: 'Cars',
    year: 2024,
    fuel: 'Diesel',
    km: '0 km',
    trans: 'Manual',
    image: U('1568605117036-5fe5e7bab0b7'),
    gallery: [U('1568605117036-5fe5e7bab0b7')]
  }],
  filters: ['All', 'Cars', 'Bikes', 'EV', 'Used']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dealer-site/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dealer-site/icons.jsx
try { (() => {
// DealerSite Pro — line icon set (Lucide-style: 24px, stroke 1.75, round).
// No brand icon assets were supplied; this is a consistent custom line set
// matching premium editorial styling. Swap for a licensed set if available.
const Svg = ({
  size = 24,
  children,
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: style
}, children);
const Icons = {
  car: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 16v-2a2 2 0 0 1 1-1.7L5 11h14l1 .3A2 2 0 0 1 21 14v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "13.5",
    r: ".6",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "13.5",
    r: ".6",
    fill: "currentColor"
  })),
  bike: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "5.5",
    cy: "17",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18.5",
    cy: "17",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 17l3.2-6h4.3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.7 11L9 7H6.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11l2.5 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 7h3l-1 2"
  })),
  ev: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z"
  })),
  auto: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h10v8H3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 10h4l3 3v2h-7z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 7V5h10v2"
  })),
  used: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 13.5l1.5 1.5 3-3"
  })),
  brands: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 7.5l8 4.5 8-4.5"
  })),
  enquiry: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 5h16v11H8l-4 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 9h8M8 12h5"
  })),
  phone: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
  })),
  whatsapp: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 20l1.4-4A8 8 0 1 1 8 18.6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 10c0 3 2 5 5 5l.8-1.6-2-.9-.8.9a4 4 0 0 1-2-2l.9-.8-.9-2z"
  })),
  testdrive: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.2 10.8l3-2.3"
  })),
  dashboard: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "8",
    height: "8",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "3",
    width: "8",
    height: "5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "10",
    width: "8",
    height: "11",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "13",
    width: "8",
    height: "8",
    rx: "1.5"
  })),
  palette: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "11",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "7.5",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14.5",
    cy: "7.5",
    r: "1",
    fill: "currentColor"
  })),
  swatch: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "4",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "14",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
  })),
  globe: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"
  })),
  link: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 15l6-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 6.5l1.5-1.5a4 4 0 0 1 5.5 5.5L15 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 17.5L12 19a4 4 0 0 1-5.5-5.5L9 11"
  })),
  template: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18M9 9v11"
  })),
  logo: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.5h2.5a3.5 3.5 0 0 1 0 7H9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.5v7"
  })),
  check: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })),
  arrowRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 12h15M13 6l6 6-6 6"
  })),
  arrowUpRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M7 17L17 7M8 7h9v9"
  })),
  chevronRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })),
  star: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.6L20.5 9.4l-4.3 4.1 1 6L12 16.8 6.8 19.5l1-6-4.3-4.1 5.9-.8z",
    fill: "currentColor",
    stroke: "none"
  })),
  spark: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z",
    fill: "currentColor",
    stroke: "none"
  })),
  play: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M7 5l11 7-11 7z",
    fill: "currentColor",
    stroke: "none"
  })),
  menu: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M3 12h18M3 18h18"
  })),
  mapPin: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.5"
  })),
  fuel: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "3",
    width: "9",
    height: "18",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 8h3l2 2v7a1.5 1.5 0 0 1-3 0v-4h-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 11h9"
  })),
  gauge: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 16a8 8 0 1 1 16 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16l4-4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "16",
    r: "1.2",
    fill: "currentColor"
  }))
};
window.Icons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dealer-site/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/DealerPreview.jsx
try { (() => {
// DealerSite Pro — a realistic mock dealer website inside a browser frame.
// Reused in the hero (floating) and the showcase. `device` = 'desktop'|'mobile'.
// `theme` makes it live-skinnable for the interactive Showcase switcher.
const DSP_THEMES = {
  showroom: {
    key: 'showroom',
    label: 'Clean Showroom',
    name: 'Shrama Motors',
    initial: 'S',
    logo: '../../assets/sharma-motors-emblem.png',
    accent: '#0B0E12',
    onAccent: '#FFFDF7',
    url: 'shramamotors.dealersite.pro',
    hero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=72',
    tagline: 'Drive home\nsomething premium.'
  },
  bronze: {
    key: 'bronze',
    label: 'Premium Used',
    name: 'Apex Auto Gallery',
    initial: 'A',
    accent: '#A8793A',
    onAccent: '#FFFDF7',
    url: 'apexautogallery.in',
    hero: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=72',
    tagline: 'Certified pre-owned,\nshowroom-fresh.'
  },
  electric: {
    key: 'electric',
    label: 'EV First',
    name: 'Volt Motors',
    initial: 'V',
    accent: '#16794d',
    onAccent: '#FFFDF7',
    url: 'voltmotors.in',
    hero: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=72',
    tagline: 'The future is\nfully charged.'
  }
};
window.DSP_THEMES = DSP_THEMES;
function BrowserChrome({
  url = 'sharmamotors.dealersite.pro',
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream-50)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-float)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 14px',
      background: 'var(--cream-100)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#E7E0D7'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#E7E0D7'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#E7E0D7'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      marginLeft: 6,
      height: 24,
      borderRadius: 'var(--radius-full)',
      background: 'var(--cream-50)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '0 12px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.globe, {
    size: 12,
    style: {
      opacity: 0.6
    }
  }), " ", url)), children);
}
function DealerEmblem({
  theme,
  size = 30
}) {
  const ac = theme.accent,
    on = theme.onAccent;
  if (theme.logo) {
    return /*#__PURE__*/React.createElement("img", {
      src: theme.logo,
      alt: theme.name + ' logo',
      style: {
        height: Math.round(size * 1.12),
        width: 'auto',
        display: 'block',
        flex: 'none'
      }
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: 'none',
      borderRadius: Math.round(size * 0.28),
      background: ac,
      color: on,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.car, {
    size: Math.round(size * 0.62)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: Math.round(size * 0.16),
      right: Math.round(size * 0.18),
      width: Math.max(3, Math.round(size * 0.13)),
      height: Math.max(3, Math.round(size * 0.13)),
      borderRadius: '50%',
      background: on,
      opacity: 0.9
    }
  }));
}
function DealerSiteContent({
  compact = false,
  theme = DSP_THEMES.showroom
}) {
  const D = window.DSP_DATA;
  const tiles = D.vehicles.slice(0, compact ? 2 : 3);
  const ac = theme.accent,
    on = theme.onAccent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 12 : 20,
      padding: compact ? '12px 16px' : '16px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(DealerEmblem, {
    theme: theme,
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: compact ? 14 : 16,
      color: 'var(--text-strong)',
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap'
    }
  }, theme.name)), !compact && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      marginLeft: 'auto',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Inventory"), /*#__PURE__*/React.createElement("span", null, "About"), /*#__PURE__*/React.createElement("span", null, "Finance"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "Contact")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      marginLeft: compact ? 'auto' : 0,
      padding: '7px 13px',
      borderRadius: 'var(--radius-full)',
      background: ac,
      color: on,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, "Enquire")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: compact ? 130 : 188,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: theme.hero,
    alt: "Featured vehicle",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(11,14,18,0.78) 0%, rgba(11,14,18,0.32) 55%, transparent 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: compact ? 16 : 24,
      top: '50%',
      transform: 'translateY(-50%)',
      maxWidth: '64%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'rgba(255,253,247,0.7)',
      marginBottom: 6
    }
  }, "Featured this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: compact ? 18 : 26,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--cream-50)',
      marginBottom: compact ? 8 : 12,
      whiteSpace: 'pre-line'
    }
  }, theme.tagline), !compact && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '8px 14px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--cream-50)',
      color: 'var(--ink-900)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700
    }
  }, "Browse inventory"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: compact ? '14px 16px' : '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: compact ? 13 : 15,
      color: 'var(--text-strong)'
    }
  }, "Latest inventory"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      color: ac,
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${tiles.length}, 1fr)`,
      gap: 12
    }
  }, tiles.map(v => /*#__PURE__*/React.createElement("div", {
    key: v.name,
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'var(--cream-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/3',
      overflow: 'hidden',
      background: 'var(--cream-300)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: v.image,
    alt: v.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 7,
      left: 7,
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      background: ac,
      color: on,
      fontFamily: 'var(--font-body)',
      fontSize: 9,
      fontWeight: 700,
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, v.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: compact ? 11 : 12.5,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, v.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: compact ? 11 : 12.5,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, v.price), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 8px',
      borderRadius: 'var(--radius-full)',
      border: `1px solid ${ac}`,
      color: ac,
      fontFamily: 'var(--font-body)',
      fontSize: 9.5,
      fontWeight: 700,
      transition: 'border-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
    }
  }, "Enquire"))))))));
}
function MobileDealerSite({
  theme
}) {
  const D = window.DSP_DATA;
  const ac = theme.accent,
    on = theme.onAccent;
  const tiles = D.vehicles.slice(0, 3);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream-50)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '9px 20px 4px',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "11",
    viewBox: "0 0 18 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7",
    width: "3",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "4",
    width: "3",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "1.5",
    width: "3",
    height: "10.5",
    rx: "1",
    opacity: "0.4"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "11",
    viewBox: "0 0 16 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.5C4.5 1.5 11.5 1.5 15 4.5M3.2 7C5.5 5 10.5 5 12.8 7M6 9.4c1-.9 3-.9 4 0",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 8,
      border: '1.2px solid currentColor',
      borderRadius: 2,
      display: 'inline-flex',
      padding: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: 'currentColor',
      borderRadius: 1
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(DealerEmblem, {
    theme: theme,
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, theme.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M3 12h18M3 18h18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 18,
      overflow: 'hidden',
      height: 168,
      flex: 'none',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: theme.hero,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(11,14,18,0.86) 8%, rgba(11,14,18,0.15) 60%, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      right: 14,
      bottom: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8.5,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'rgba(255,253,247,0.75)',
      marginBottom: 5
    }
  }, "Featured this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 17,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--cream-50)',
      whiteSpace: 'pre-line',
      marginBottom: 9
    }
  }, theme.tagline), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      padding: '6px 13px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--cream-50)',
      color: 'var(--ink-900)',
      fontSize: 10.5,
      fontWeight: 700,
      whiteSpace: 'nowrap'
    }
  }, "Browse inventory"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      flex: 'none'
    }
  }, ['All', 'Cars', 'Bikes', 'EV'].map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      padding: '6px 13px',
      borderRadius: 'var(--radius-full)',
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      background: i === 0 ? ac : 'var(--cream-200)',
      color: i === 0 ? on : 'var(--text-body)',
      border: i === 0 ? 'none' : '1px solid var(--border-default)'
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, tiles.map(v => /*#__PURE__*/React.createElement("div", {
    key: v.name,
    style: {
      display: 'flex',
      gap: 11,
      padding: 9,
      borderRadius: 14,
      border: '1px solid var(--border-subtle)',
      background: 'var(--cream-50)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 78,
      height: 62,
      flex: 'none',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--cream-300)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: v.image,
    alt: v.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 5,
      left: 5,
      padding: '1px 6px',
      borderRadius: 'var(--radius-full)',
      background: ac,
      color: on,
      fontSize: 7.5,
      fontWeight: 700
    }
  }, v.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 12.5,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, v.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, v.specs.slice(0, 2).map((sp, si) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: sp
  }, si > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: 'var(--text-faint)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, sp)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 13,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, v.price), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 9px',
      borderRadius: 'var(--radius-full)',
      border: `1px solid ${ac}`,
      color: ac,
      fontSize: 9,
      fontWeight: 700
    }
  }, "Enquire"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      display: 'flex',
      gap: 8,
      padding: '10px 14px 8px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--cream-50)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 36,
      borderRadius: 'var(--radius-full)',
      background: ac,
      color: on,
      fontSize: 11.5,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
  })), "Call now"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 36,
      borderRadius: 'var(--radius-full)',
      background: 'var(--cream-50)',
      border: `1px solid ${ac}`,
      color: ac,
      fontSize: 11.5,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 20l1.4-4A8 8 0 1 1 8 18.6z"
  })), "WhatsApp")));
}
function DealerPreview({
  device = 'desktop',
  url,
  theme = DSP_THEMES.showroom,
  style = {}
}) {
  if (device === 'mobile') {
    return (
      /*#__PURE__*/
      // iPhone 17 Pro Max — titanium frame, thin uniform bezels, Dynamic Island
      React.createElement("div", {
        style: {
          position: 'relative',
          width: 252,
          height: 540,
          ...style
        }
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          left: -2.5,
          top: 96,
          width: 3,
          height: 26,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1a1a1c, #48484a)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          left: -2.5,
          top: 138,
          width: 3,
          height: 40,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1a1a1c, #48484a)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          left: -2.5,
          top: 186,
          width: 3,
          height: 40,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1a1a1c, #48484a)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          right: -2.5,
          top: 120,
          width: 3,
          height: 34,
          borderRadius: 3,
          background: 'linear-gradient(270deg, #1a1a1c, #48484a)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          right: -2.5,
          top: 172,
          width: 3,
          height: 64,
          borderRadius: 3,
          background: 'linear-gradient(270deg, #1a1a1c, #48484a)'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          borderRadius: 52,
          padding: 2.5,
          background: 'linear-gradient(145deg, #6b6b6e 0%, #2c2c2e 22%, #1b1b1d 50%, #2c2c2e 78%, #5a5a5d 100%)',
          boxShadow: 'var(--shadow-float)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          height: '100%',
          borderRadius: 49.5,
          padding: 9,
          background: '#050608'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          height: '100%',
          borderRadius: 41,
          overflow: 'hidden',
          background: 'var(--cream-50)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 92,
          height: 27,
          borderRadius: 'var(--radius-full)',
          background: '#050608',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #2b3a52, #070b12 70%)',
          boxShadow: 'inset 0 0 0 1px rgba(120,150,200,0.25)'
        }
      })), /*#__PURE__*/React.createElement(MobileDealerSite, {
        theme: theme
      }), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          bottom: 7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          height: 4,
          borderRadius: 'var(--radius-full)',
          background: 'var(--ink-900)',
          opacity: 0.26,
          zIndex: 6
        }
      })))))
    );
  }
  return /*#__PURE__*/React.createElement(BrowserChrome, {
    url: url || theme.url,
    style: style
  }, /*#__PURE__*/React.createElement(DealerSiteContent, {
    theme: theme
  }));
}
window.DealerPreview = DealerPreview;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/DealerPreview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Elevate.jsx
try { (() => {
// DealerSite Pro — elevation sections: animated stats band + brand marquee.

// Count-up number that animates when scrolled into view.
function CountUp({
  to,
  prefix = '',
  suffix = '',
  dur = 1400
}) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf,
      started = false;
    const run = t0 => {
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);else setVal(to);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          run(performance.now());
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  const display = Number.isInteger(to) ? Math.round(val).toLocaleString('en-IN') : val.toFixed(1);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref
  }, prefix, display, suffix);
}
function StatsBand() {
  const stats = [{
    node: /*#__PURE__*/React.createElement(CountUp, {
      to: 500,
      suffix: "+"
    }),
    label: 'Dealers onboarded',
    sub: 'across 12 Indian cities'
  }, {
    node: /*#__PURE__*/React.createElement(CountUp, {
      to: 2400,
      suffix: "+"
    }),
    label: 'Enquiries captured',
    sub: 'every single month'
  }, {
    node: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CountUp, {
      to: 48
    }), "hrs"),
    label: 'Average time to live',
    sub: 'from first sign-up'
  }, {
    node: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CountUp, {
      to: 4.8
    }), "/5"),
    label: 'Dealer satisfaction',
    sub: 'from 320+ reviews'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-stage)',
      paddingBottom: 'var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      borderTop: '1px solid var(--border-inverse)',
      borderBottom: '1px solid var(--border-inverse)'
    },
    className: "dsp-stats-band"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    className: "dsp-stat-cell",
    style: {
      padding: '40px clamp(16px, 3vw, 40px)',
      borderLeft: i === 0 ? 'none' : '1px solid var(--border-inverse)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
      letterSpacing: '-0.04em',
      lineHeight: 1,
      color: 'var(--cream-50)'
    }
  }, s.node), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--text-base)',
      color: 'var(--cream-50)',
      marginTop: 6
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-on-dark-muted)'
    }
  }, s.sub))))));
}
function BrandStrip() {
  const brands = ['MARUTI SUZUKI', 'HYUNDAI', 'TATA MOTORS', 'MAHINDRA', 'HONDA', 'TOYOTA', 'ROYAL ENFIELD', 'KIA', 'TVS', 'ASHOK LEYLAND'];
  const Row = ({
    ariaHidden
  }) => /*#__PURE__*/React.createElement("div", {
    "aria-hidden": ariaHidden,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(36px, 6vw, 72px)',
      paddingRight: 'clamp(36px, 6vw, 72px)',
      flex: 'none'
    }
  }, brands.map(b => /*#__PURE__*/React.createElement("span", {
    key: b,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: '0.04em',
      color: 'var(--stone-400)',
      whiteSpace: 'nowrap',
      flex: 'none'
    }
  }, b)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-default)',
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 26px',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Every brand on your floor \u2014 one website")), /*#__PURE__*/React.createElement("div", {
    className: "dsp-marquee",
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dsp-marquee-track",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Row, null), /*#__PURE__*/React.createElement(Row, {
    ariaHidden: true
  }))));
}
Object.assign(window, {
  CountUp,
  StatsBand,
  BrandStrip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Elevate.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Header.jsx
try { (() => {
// DealerSite Pro — top navigation + hero (the most important section).
function Logo({
  dark = false
}) {
  const c = dark ? 'var(--cream-50)' : 'var(--text-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      background: dark ? 'var(--cream-50)' : 'var(--ink-900)',
      color: dark ? 'var(--ink-900)' : 'var(--cream-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 18,
      letterSpacing: '-0.04em'
    }
  }, "D"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: '-0.025em',
      color: c
    }
  }, "DealerSite", /*#__PURE__*/React.createElement("span", {
    style: {
      color: dark ? 'var(--bronze-400)' : 'var(--accent)'
    }
  }, " Pro")));
}
function TopNav({
  step,
  setStep
}) {
  const {
    Button
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      paddingTop: 26,
      paddingBottom: 26,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    dark: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dsp-topnav-links",
    style: {
      display: 'flex',
      gap: 26,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#dealers",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, "Dealers"), /*#__PURE__*/React.createElement("a", {
    href: "#preview",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, "Preview"), /*#__PURE__*/React.createElement("a", {
    href: "#pricing",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, "Pricing"), /*#__PURE__*/React.createElement("a", {
    href: "#faq",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, "FAQ")), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 16
    })
  }, "Create My Website"))));
}
function FloatBubble({
  style
}) {
  const {
    Avatar
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '11px 15px 11px 11px',
      background: 'var(--cream-50)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      border: '1px solid var(--border-default)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "New Lead",
    size: 38
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'var(--success)',
      border: '2px solid var(--cream-50)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, "New enquiry"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Creta SX \xB7 test drive")));
}
function DomainBadge({
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '9px 14px',
      background: 'var(--ink-900)',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-xl)',
      color: 'var(--cream-50)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(window.Icons.globe, {
    size: 15,
    style: {
      color: 'var(--bronze-400)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 500
    }
  }, "sharmamotors.in"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.check, {
    size: 13
  }), " Live"));
}
function Hero({
  step,
  setStep
}) {
  const {
    Button,
    Badge,
    Avatar
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement(window.Container, {
    wide: true,
    style: {
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    className: "dsp-hero-canvas",
    style: {
      background: 'var(--surface-canvas)',
      borderRadius: 'var(--radius-3xl)',
      padding: 'clamp(28px, 4vw, 64px)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 0 rgba(255,255,255,0.5) inset'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -160,
      right: -120,
      width: 520,
      height: 520,
      background: 'radial-gradient(circle, rgba(255,253,247,0.9), rgba(245,241,234,0) 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-hero-grid",
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1.04fr',
      gap: 'clamp(32px, 4vw, 64px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 40
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    size: "md"
  }, /*#__PURE__*/React.createElement(window.Icons.spark, {
    size: 13,
    style: {
      color: 'var(--accent)'
    }
  }), " V1 Dealer Launch Kit")), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.8rem, 6vw, 4.75rem)',
      lineHeight: 0.98,
      letterSpacing: '-0.035em',
      color: 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, "Launch a dealer website that ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      fontWeight: 800
    }
  }, "sells."))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 150
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 460,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.55,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, "Add your showroom, vehicles, brand style, and domain. DealerSite Pro turns it into a polished website for cars, bikes, and autos.")), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 210,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 18
    })
  }, "Create My Website"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.play, {
      size: 15
    })
  }, "See Sample Site")), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 270,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      marginTop: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, ['Rohit Sharma', 'Priya Nair', 'Amit Verma', 'Sana Khan'].map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      marginLeft: i === 0 ? 0 : -10,
      borderRadius: '50%',
      boxShadow: '0 0 0 2px var(--surface-canvas)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: n,
    size: 32
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      color: 'var(--accent)'
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(window.Icons.star, {
    key: i,
    size: 14
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Loved by ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "500+ dealers"), " across India")))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 160,
    className: "dsp-hero-preview",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '8% -2% -6% 6%',
      background: 'var(--ink-900)',
      borderRadius: 'var(--radius-2xl)',
      opacity: 0.06,
      transform: 'rotate(2deg)'
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-car-float"
  }, /*#__PURE__*/React.createElement(window.DealerPreview, {
    device: "desktop",
    style: {
      position: 'relative',
      transform: 'perspective(1400px) rotateY(-7deg) rotateX(3deg)',
      transformOrigin: 'center'
    }
  })), /*#__PURE__*/React.createElement(FloatBubble, {
    style: {
      position: 'absolute',
      left: -28,
      bottom: 38,
      zIndex: 3
    }
  }), /*#__PURE__*/React.createElement(DomainBadge, {
    style: {
      position: 'absolute',
      right: -18,
      top: -16,
      zIndex: 3
    }
  })))));
}
function Header({
  step,
  setStep
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surface-stage)',
      paddingBottom: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,253,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,253,247,0.05) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      maskImage: 'radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)',
      WebkitMaskImage: 'radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -180,
      left: '12%',
      width: 620,
      height: 480,
      background: 'radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 68%)',
      pointerEvents: 'none',
      filter: 'blur(8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -120,
      right: '6%',
      width: 520,
      height: 460,
      background: 'radial-gradient(ellipse at center, rgba(110,124,160,0.18), transparent 70%)',
      pointerEvents: 'none',
      filter: 'blur(8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    step: step,
    setStep: setStep
  }), /*#__PURE__*/React.createElement(Hero, {
    step: step,
    setStep: setStep
  })));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Layout.jsx
try { (() => {
// DealerSite Pro — layout primitives for the landing page.
function Container({
  children,
  wide = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: wide ? 'var(--container-wide)' : 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      ...style
    }
  }, children);
}

// A full-bleed section. tone: 'stage' (dark) | 'canvas' (cream) | 'page'
function Section({
  children,
  tone = 'page',
  id,
  style = {}
}) {
  const bg = tone === 'stage' ? 'var(--surface-stage)' : tone === 'canvas' ? 'var(--surface-canvas)' : 'var(--surface-page)';
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      background: bg,
      paddingTop: 'var(--section-y)',
      paddingBottom: 'var(--section-y)',
      ...style
    }
  }, children);
}

// Centered section header: eyebrow + headline + optional sub.
function SectionHead({
  eyebrow,
  title,
  sub,
  dark = false,
  align = 'center',
  max = 720
}) {
  const {
    Eyebrow
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement(window.Reveal, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      maxWidth: max,
      margin: align === 'center' ? '0 auto' : 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement(Eyebrow, {
    tone: dark ? 'dark' : 'light'
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'clamp(2rem, 4.2vw, 3rem)',
      lineHeight: 1.05,
      letterSpacing: 'var(--tracking-tight)',
      color: dark ? 'var(--cream-50)' : 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.55,
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-body)',
      maxWidth: 580,
      textWrap: 'pretty'
    }
  }, sub));
}
Object.assign(window, {
  Container,
  Section,
  SectionHead
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Layout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Pricing.jsx
try { (() => {
// DealerSite Pro — Pricing + FAQ: the decision section that closes the journey.
const DSP_PRICING = [{
  name: 'Starter',
  price: '₹0',
  period: '/forever',
  tagline: 'Get online today on a free subdomain.',
  cta: 'Start free',
  variant: 'secondary',
  featured: false,
  features: ['1 dealer website', 'Free yourname.dealersite.pro', 'Up to 25 vehicles', 'Enquiry & WhatsApp leads', 'Mobile-ready templates']
}, {
  name: 'Pro',
  price: '₹1,499',
  period: '/month',
  tagline: 'Your own domain, unlimited stock, full leads.',
  cta: 'Start 14-day trial',
  variant: 'accent',
  featured: true,
  badge: 'Most popular',
  features: ['Everything in Starter', 'Connect your own domain', 'Unlimited vehicles', 'Lead dashboard + call tracking', 'Brand colours & logo', 'Test-drive booking']
}, {
  name: 'Multi-Brand',
  price: '₹3,999',
  period: '/month',
  tagline: 'For groups selling many brands & locations.',
  cta: 'Talk to sales',
  variant: 'secondary',
  featured: false,
  features: ['Everything in Pro', 'Up to 5 showroom locations', 'Per-brand layouts', 'Team accounts & roles', 'Priority support']
}];
const DSP_FAQ = [{
  q: 'Do I need any technical skills?',
  a: 'None at all. If you can fill a form, you can launch a DealerSite Pro website. The guided wizard takes you from sign-up to live in five steps.'
}, {
  q: 'Can I use my own domain?',
  a: 'Yes. Start free on a yourname.dealersite.pro subdomain, then connect any .com or .in domain you own on the Pro plan — we walk you through it in minutes.'
}, {
  q: 'What kinds of vehicles does it support?',
  a: 'Cars, bikes, scooters, EVs, autos, and three-wheelers. Layouts adapt to each category, and multi-brand dealers can show every brand on one site.'
}, {
  q: 'How do leads reach me?',
  a: 'Every enquiry, call, WhatsApp message, and test-drive request lands in one lead dashboard — and pings you instantly so you never miss a buyer.'
}, {
  q: 'Can I change my plan later?',
  a: 'Anytime. Upgrade, downgrade, or cancel from your dashboard with no lock-in. Your website and leads stay exactly where they are.'
}];
function PlanCard({
  plan
}) {
  const {
    Button
  } = window.DesignSystem_a49d67;
  const featured = plan.featured;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      padding: featured ? 'clamp(28px, 3vw, 40px)' : 'clamp(24px, 3vw, 36px)',
      background: featured ? 'var(--surface-stage)' : 'var(--surface-card)',
      border: `1px solid ${featured ? 'transparent' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-2xl)',
      boxShadow: featured ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
      transform: featured ? 'translateY(-10px)' : 'none',
      overflow: 'hidden',
      height: '100%'
    }
  }, featured && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -110,
      right: -70,
      width: 300,
      height: 300,
      background: 'radial-gradient(circle, rgba(199,154,91,0.22), transparent 68%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-xl)',
      letterSpacing: '-0.02em',
      color: featured ? 'var(--cream-50)' : 'var(--text-strong)'
    }
  }, plan.name), plan.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 11px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--accent)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.02em'
    }
  }, plan.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.4rem, 4vw, 3rem)',
      letterSpacing: '-0.04em',
      color: featured ? 'var(--cream-50)' : 'var(--text-strong)'
    }
  }, plan.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      fontWeight: 600,
      color: featured ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, plan.period)), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'relative',
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.5,
      color: featured ? 'var(--text-on-dark-muted)' : 'var(--text-body)',
      minHeight: 40
    }
  }, plan.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: plan.variant,
    size: "lg",
    fullWidth: true
  }, plan.cta)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 1,
      background: featured ? 'var(--border-inverse)' : 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      position: 'relative',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, plan.features.map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: featured ? 'var(--cream-50)' : 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      marginTop: 1,
      color: featured ? 'var(--bronze-400)' : 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.check, {
    size: 16
  })), f))));
}
function Pricing() {
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "canvas",
    id: "pricing"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Simple pricing",
    title: "Start free. Upgrade when you sell more.",
    sub: "No setup fees, no lock-in. Every plan includes hosting, leads, and mobile-ready templates."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-price-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 22,
      marginTop: 60,
      alignItems: 'stretch'
    }
  }, DSP_PRICING.map((p, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: p.name,
    delay: i * 90,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(PlanCard, {
    plan: p
  })))))));
}
function FaqRow({
  item,
  open,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '24px 4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      letterSpacing: '-0.015em',
      color: 'var(--text-strong)'
    }
  }, item.q), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-strong)',
      transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out)',
      transform: open ? 'rotate(45deg)' : 'none',
      background: open ? 'var(--cream-200)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 3v10M3 8h10"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: open ? 220 : 0,
      transition: 'max-height var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: '0 48px 24px 4px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 1.6,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, item.a)));
}
function Faq() {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "faq"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement("div", {
    className: "dsp-faq-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 'clamp(32px, 5vw, 80px)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    align: "left",
    max: 420,
    eyebrow: "Questions",
    title: "Everything you need to know.",
    sub: "Still unsure? Our team replies on WhatsApp within the hour."
  })), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("div", null, DSP_FAQ.map((item, i) => /*#__PURE__*/React.createElement(FaqRow, {
    key: item.q,
    item: item,
    open: open === i,
    onToggle: () => setOpen(open === i ? -1 : i)
  })))))));
}
Object.assign(window, {
  Pricing,
  Faq
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Pricing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Reveal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DealerSite Pro — scroll reveal (IntersectionObserver). Substitutes Framer
// Motion in this environment: fade + subtle rise, optional stagger delay.
// Honors prefers-reduced-motion.
function Reveal({
  children,
  delay = 0,
  y = 22,
  as = 'div',
  style = {},
  ...rest
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  const reduce = React.useRef(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  React.useEffect(() => {
    if (reduce.current) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Already in (or near) the viewport on mount — reveal right away so
    // above-the-fold content (hero) never sits hidden.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.92) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    // Safety net: never leave content invisible (covers capture/print edge cases).
    const t = setTimeout(() => setShown(true), 2600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    style: {
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity var(--dur-reveal) var(--ease-out) ${delay}ms, transform var(--dur-reveal) var(--ease-out) ${delay}ms`,
      willChange: 'opacity, transform',
      ...style
    }
  }, rest), children);
}
window.Reveal = Reveal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Reveal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Search.jsx
try { (() => {
// DealerSite Pro — Search & discover: buyers search inventory and see full specs.
function SearchDiscover() {
  const D = window.DSP_DATA;
  const filters = ['Under ₹10 L', 'Petrol', 'Automatic', '2022+', 'SUV'];
  const v = D.vehicles[0]; // Hyundai Creta SX
  const specs = [{
    icon: 'gauge',
    label: 'Year',
    value: '2024'
  }, {
    icon: 'fuel',
    label: 'Fuel',
    value: 'Petrol'
  }, {
    icon: 'car',
    label: 'Transmission',
    value: 'Automatic'
  }, {
    icon: 'testdrive',
    label: 'Driven',
    value: '0 km'
  }];
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "search"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Search & discover",
    title: "Buyers find the right vehicle in seconds.",
    sub: "Every site comes with smart search and filters \u2014 visitors look up any vehicle and see full specs, photos, and price before they enquire."
  }), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 100,
    style: {
      marginTop: 56,
      maxWidth: 940,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'clamp(18px, 2.4vw, 26px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 54,
      padding: '0 18px',
      background: 'var(--cream-100)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-full)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(window.Icons.search, {
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, "Creta automatic", /*#__PURE__*/React.createElement("span", {
    className: "dsp-caret",
    style: {
      display: 'inline-block',
      width: 2,
      height: 20,
      background: 'var(--ink-900)',
      marginLeft: 2,
      transform: 'translateY(3px)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 38,
      padding: '0 18px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 700
    }
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 16
    }
  }, filters.map((f, i) => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 13px',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      background: i < 2 ? 'var(--ink-900)' : 'var(--cream-200)',
      color: i < 2 ? 'var(--cream-50)' : 'var(--text-body)',
      border: i < 2 ? 'none' : '1px solid var(--border-default)'
    }
  }, i < 2 && /*#__PURE__*/React.createElement(window.Icons.check, {
    size: 13
  }), f)))), /*#__PURE__*/React.createElement("div", {
    className: "dsp-search-result",
    style: {
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: 230,
      background: 'var(--cream-300)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: v.image,
    alt: v.name,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14,
      padding: '4px 11px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 700
    }
  }, "1 match \xB7 ", v.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'clamp(22px, 2.6vw, 32px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-2xl)',
      letterSpacing: '-0.025em',
      color: 'var(--text-strong)',
      lineHeight: 1.1
    }
  }, v.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, "Petrol \xB7 Automatic \xB7 1.5L")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'var(--text-2xl)',
      letterSpacing: '-0.03em',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, v.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, specs.map(s => {
    const Icon = window.Icons[s.icon];
    return /*#__PURE__*/React.createElement("div", {
      key: s.label,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 13px',
        background: 'var(--cream-100)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 18
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, s.value)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      height: 44,
      borderRadius: 'var(--radius-md)',
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 700
    }
  }, "View full details"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      height: 44,
      padding: '0 18px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(window.Icons.whatsapp, {
    size: 16
  }), " Enquire"))))))));
}
window.SearchDiscover = SearchDiscover;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Search.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/SectionsEnd.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DealerSite Pro — Leads, Brand & Domain, Templates, Final CTA, Footer.
function LeadChannel({
  icon,
  name,
  blurb
}) {
  const Icon = window.Icons[icon];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      background: 'var(--cream-200)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 21
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, blurb)));
}
function LeadDashboard() {
  const rows = [{
    n: 'Priya Nair',
    v: 'Creta SX · Test drive',
    t: '2m',
    c: 'whatsapp'
  }, {
    n: 'Amit Verma',
    v: 'Swift VXi · Enquiry',
    t: '14m',
    c: 'enquiry'
  }, {
    n: 'Sana Khan',
    v: 'Nexon EV · Call back',
    t: '1h',
    c: 'phone'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-dark)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-inverse)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      color: 'var(--cream-50)'
    }
  }, "Lead Dashboard"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--success)'
    }
  }), " Live")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map(r => {
    const Icon = window.Icons[r.c];
    return /*#__PURE__*/React.createElement("div", {
      key: r.n,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'rgba(255,253,247,0.04)',
        border: '1px solid var(--border-inverse)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        flex: 'none',
        borderRadius: '50%',
        background: 'rgba(255,253,247,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--bronze-400)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--cream-50)'
      }
    }, r.n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--text-on-dark-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, r.v)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-on-dark-muted)'
      }
    }, r.t));
  })));
}
function Leads() {
  const D = window.DSP_DATA;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "leads"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Leads included",
    title: "Every website is built to convert.",
    sub: "Visitors turn into enquiries, calls, and test drives \u2014 all captured in one place."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-leads-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      marginTop: 56,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, null, /*#__PURE__*/React.createElement(LeadDashboard, null)), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 90,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, D.leads.slice(0, 4).map(l => /*#__PURE__*/React.createElement(LeadChannel, _extends({
    key: l.name
  }, l)))))));
}
function BrandDomain() {
  const {
    Input,
    Button
  } = window.DesignSystem_a49d67;
  const D = window.DSP_DATA;
  const swatches = ['#0B0E12', '#A8793A', '#2E8B5A', '#C7453E', '#1E5BFF'];
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "canvas",
    id: "brand"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement("div", {
    className: "dsp-brand-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(32px,5vw,72px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.SectionHead, {
    align: "left",
    max: 520,
    eyebrow: "Brand & domain control",
    title: "Your brand. Your domain. Your site.",
    sub: "Make it unmistakably yours, then publish on a free subdomain or connect a domain you already own."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 32
    }
  }, D.brandControls.map((b, i) => {
    const Icon = window.Icons[b.icon];
    return /*#__PURE__*/React.createElement(window.Reveal, {
      key: b.name,
      delay: i * 60,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-900)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 18
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-base)',
        color: 'var(--text-strong)'
      }
    }, b.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, " \u2014 ", b.blurb)));
  }))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      padding: '0 6px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--cream-100)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/sharma-motors-emblem.png",
    alt: "Shrama Motors logo",
    style: {
      height: 34,
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, "Shrama Motors"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Logo \xB7 uploaded"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, "Brand colour"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, swatches.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: c,
      border: i === 1 ? '2px solid var(--ink-900)' : '1px solid var(--border-default)',
      boxShadow: i === 1 ? '0 0 0 3px var(--cream-50), 0 0 0 4px var(--ink-900)' : 'none'
    }
  })))), /*#__PURE__*/React.createElement(Input, {
    label: "Custom domain",
    defaultValue: "sharmamotors.in",
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.globe, {
      size: 16
    }),
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--success)'
      }
    }, /*#__PURE__*/React.createElement(window.Icons.check, {
      size: 14
    }), " Verified")
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 17
    })
  }, "Publish website"))))));
}
function Templates() {
  const D = window.DSP_DATA;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "templates"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Templates & styles",
    title: "Start from a style that fits your floor.",
    sub: "Five dealer-ready templates \u2014 pick one, apply your brand, and you're 90% there."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-tpl-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 20,
      marginTop: 56
    }
  }, D.templates.map((t, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: t.name,
    delay: i * 60,
    className: i < 2 ? 'dsp-tpl-lg' : 'dsp-tpl-sm',
    style: {
      gridColumn: i < 2 ? 'span 3' : 'span 2'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dsp-tpl-card",
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      aspectRatio: i < 2 ? '16/10' : '4/5',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: t.image,
    alt: t.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(11,14,18,0.82), rgba(11,14,18,0.05) 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 14,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      color: 'var(--cream-50)',
      letterSpacing: '-0.02em',
      lineHeight: 1.1
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255,253,247,0.16)',
      backdropFilter: 'blur(6px)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700
    }
  }, t.tag))))))));
}
function FinalCTA() {
  const {
    Button
  } = window.DesignSystem_a49d67;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    style: {
      paddingBottom: 'clamp(64px, 8vw, 112px)'
    }
  }, /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-stage)',
      borderRadius: 'var(--radius-3xl)',
      padding: 'clamp(48px, 7vw, 110px) clamp(28px, 5vw, 80px)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      bottom: -180,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 720,
      height: 480,
      background: 'radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      maxWidth: 880,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
      lineHeight: 1.02,
      letterSpacing: '-0.035em',
      color: 'var(--cream-50)',
      textWrap: 'balance'
    }
  }, "Your dealership website can go live faster than you think."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 560,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.55,
      color: 'var(--text-on-dark-muted)',
      textWrap: 'pretty'
    }
  }, "Start with your showroom details, pick your vehicles, and publish a professional website built for leads."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowRight, {
      size: 18
    })
  }, "Create My Website"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: 'var(--cream-50)'
    },
    iconLeft: /*#__PURE__*/React.createElement(window.Icons.play, {
      size: 15
    })
  }, "View Demo"))))));
}
function Footer() {
  const cols = [{
    h: 'Product',
    links: ['Templates', 'Pricing', 'Sample sites', 'Custom domains']
  }, {
    h: 'Dealers',
    links: ['Cars', 'Bikes & scooters', 'EV dealers', 'Used vehicles']
  }, {
    h: 'Company',
    links: ['About', 'Contact', 'Support', 'Careers']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-stage)',
      paddingTop: 'var(--section-y)',
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "dsp-footer-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3, 1fr)',
      gap: 40,
      paddingBottom: 48,
      borderBottom: '1px solid var(--border-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 20,
      letterSpacing: '-0.025em',
      color: 'var(--cream-50)'
    }
  }, "DealerSite", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--bronze-400)'
    }
  }, " Pro")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text-on-dark-muted)'
    }
  }, "Professional dealership websites for cars, bikes, EVs, and autos \u2014 without code.")), cols.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)'
    }
  }, col.h), col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--cream-50)',
      textDecoration: 'none',
      opacity: 0.78
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "\xA9 2026 DealerSite Pro. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Terms")))));
}
Object.assign(window, {
  Leads,
  BrandDomain,
  Templates,
  FinalCTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/SectionsEnd.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/SectionsMid.jsx
try { (() => {
// DealerSite Pro — Categories, How it works, Showcase.
function IconTile({
  name,
  dark = false,
  size = 48
}) {
  const Icon = window.Icons[name];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: dark ? 'rgba(255,253,247,0.06)' : 'var(--cream-200)',
      border: `1px solid ${dark ? 'var(--border-inverse)' : 'var(--border-default)'}`,
      color: dark ? 'var(--cream-50)' : 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: Math.round(size * 0.5)
  }));
}
function Categories() {
  const {
    Card
  } = window.DesignSystem_a49d67;
  const D = window.DSP_DATA;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "dealers"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Built for every dealer",
    title: "One platform. Every kind of showroom.",
    sub: "Cars, bikes, EVs, autos \u2014 DealerSite Pro adapts to what you sell with layouts tuned for each category."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-cat-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      marginTop: 56
    }
  }, D.categories.map((c, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: c.name,
    delay: i * 70
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "card",
    interactive: true,
    padding: "lg",
    radius: "lg",
    style: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: c.icon
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-xl)',
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, c.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 1.5,
      color: 'var(--text-body)'
    }
  }, c.blurb)))))))));
}
function HowItWorks() {
  const D = window.DSP_DATA;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "canvas",
    id: "how"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "How it works",
    title: "From showroom to website in five steps.",
    sub: "A guided setup wizard takes you from sign-up to a published, lead-ready website."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-steps",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 18,
      marginTop: 60,
      position: 'relative'
    }
  }, D.steps.map((s, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: s.title,
    delay: i * 80,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      flex: 'none',
      borderRadius: '50%',
      background: 'var(--ink-900)',
      color: 'var(--cream-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 18
    }
  }, i + 1), i < D.steps.length - 1 && /*#__PURE__*/React.createElement("span", {
    className: "dsp-step-line",
    style: {
      flex: 1,
      height: 2,
      background: 'var(--border-default)',
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.5,
      color: 'var(--text-body)'
    }
  }, s.blurb))))))));
}
function Showcase() {
  const {
    Button
  } = window.DesignSystem_a49d67;
  const themes = window.DSP_THEMES;
  const order = ['showroom', 'bronze', 'electric'];
  const [active, setActive] = React.useState('showroom');
  const theme = themes[active];
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "stage",
    id: "preview"
  }, /*#__PURE__*/React.createElement(window.Container, {
    wide: true
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    dark: true,
    eyebrow: "See it live",
    title: "Change the style. Watch it transform.",
    sub: "Pick a look and DealerSite Pro re-skins the whole site instantly \u2014 colours, branding, and layout. This is the real preview, updating live."
  }), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 80,
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 6,
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255,253,247,0.06)',
      border: '1px solid var(--border-inverse)'
    }
  }, order.map(k => {
    const t = themes[k];
    const on = active === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => setActive(k),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        height: 42,
        padding: '0 18px',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        background: on ? 'var(--cream-50)' : 'transparent',
        color: on ? 'var(--ink-900)' : 'var(--text-on-dark-muted)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: t.accent,
        boxShadow: on ? '0 0 0 2px var(--cream-50), 0 0 0 3px ' + t.accent : '0 0 0 2px rgba(255,253,247,0.25)',
        flex: 'none'
      }
    }), t.label);
  }))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 140,
    className: "dsp-showcase",
    style: {
      marginTop: 44,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 'clamp(16px, 4vw, 56px)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '6% 12% 0 12%',
      background: `radial-gradient(ellipse at center, ${theme.accent}33, transparent 70%)`,
      pointerEvents: 'none',
      transition: 'background var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 1 760px',
      maxWidth: 760,
      position: 'relative',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(window.DealerPreview, {
    key: theme.key,
    device: "desktop",
    theme: theme
  })), /*#__PURE__*/React.createElement("div", {
    className: "dsp-showcase-mobile",
    style: {
      flex: 'none',
      position: 'relative',
      zIndex: 3,
      marginBottom: -8
    }
  }, /*#__PURE__*/React.createElement(window.DealerPreview, {
    key: theme.key,
    device: "mobile",
    theme: theme
  }))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 200,
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icons.arrowUpRight, {
      size: 18
    })
  }, "See Sample Site"))));
}
Object.assign(window, {
  Categories,
  HowItWorks,
  Showcase,
  IconTile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/SectionsMid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Testimonials.jsx
try { (() => {
// DealerSite Pro — Testimonials: the human proof. Featured quote + supporting cards.
const DSP_TESTIMONIALS = {
  featured: {
    quote: 'We went from a Facebook page to a real website in one afternoon. Enquiries doubled in the first month — buyers finally take us seriously.',
    name: 'Rohit Sharma',
    role: 'Owner · Shrama Motors, Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  cards: [{
    quote: 'The WhatsApp and call buttons alone paid for it. Every lead lands in one dashboard.',
    name: 'Priya Nair',
    role: 'Apex Auto Gallery',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }, {
    quote: 'I sell bikes and EVs both — the layouts just fit. Setup took a cup of chai.',
    name: 'Amit Verma',
    role: 'Volt Motors, Nagpur',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }, {
    quote: 'Connected my own domain in minutes. Looks like an agency built it for lakhs.',
    name: 'Sana Khan',
    role: 'Khan Cars, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
  }]
};
function QuoteMark({
  color = 'var(--accent)'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "32",
    viewBox: "0 0 40 32",
    fill: color,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 32V18C0 8 5 1.5 15 0l1.6 5C10.8 6.4 8 9.7 7.7 14H15v18H0zm22 0V18C22 8 27 1.5 37 0l1.6 5C32.8 6.4 30 9.7 29.7 14H37v18H22z",
    opacity: "0.9"
  }));
}
function Testimonials() {
  const {
    Avatar,
    Card
  } = window.DesignSystem_a49d67;
  const T = DSP_TESTIMONIALS;
  return /*#__PURE__*/React.createElement(window.Section, {
    tone: "page",
    id: "testimonials"
  }, /*#__PURE__*/React.createElement(window.Container, null, /*#__PURE__*/React.createElement(window.SectionHead, {
    eyebrow: "Loved by dealers",
    title: "Real showrooms. Real results.",
    sub: "Hundreds of dealers across India run their entire online presence on DealerSite Pro."
  }), /*#__PURE__*/React.createElement("div", {
    className: "dsp-testi-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: 24,
      marginTop: 56,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-stage)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'clamp(32px, 4vw, 52px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 32,
      width: '100%',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -120,
      right: -80,
      width: 360,
      height: 360,
      background: 'radial-gradient(circle, rgba(199,154,91,0.18), transparent 68%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(QuoteMark, {
    color: "var(--bronze-400)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: 'var(--cream-50)',
      textWrap: 'pretty'
    }
  }, "\u201C", T.featured.quote, "\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: T.featured.avatar,
    name: T.featured.name,
    size: 52
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      color: 'var(--cream-50)'
    }
  }, T.featured.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-on-dark-muted)'
    }
  }, T.featured.role))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, T.cards.map((c, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: c.name,
    delay: i * 80,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "card",
    padding: "lg",
    radius: "lg",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      color: 'var(--accent)'
    }
  }, [0, 1, 2, 3, 4].map(s => /*#__PURE__*/React.createElement(window.Icons.star, {
    key: s,
    size: 14
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 1.55,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, "\u201C", c.quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: c.avatar,
    name: c.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, c.role)))))))))));
}
Object.assign(window, {
  Testimonials
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Testimonials.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/data.jsx
try { (() => {
// DealerSite Pro — demo data for previews (vehicles, imagery, content).
// Imagery via Unsplash hotlinks (automotive). Swap for licensed photos in prod.
const U = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
window.DSP_DATA = {
  heroVehicle: U('1503376780353-7e6692767b70', 1200),
  // sleek sports car
  vehicles: [{
    image: U('1552519507-da3b142c6e3d'),
    name: 'Hyundai Creta SX',
    price: '₹14.9 L',
    tag: 'New',
    specs: ['2024', 'Petrol', 'Automatic']
  }, {
    image: U('1503736334956-4c8f8e92946d'),
    name: 'Maruti Swift VXi',
    price: '₹6.25 L',
    tag: 'Used',
    specs: ['2022', 'Petrol', '18,500 km']
  }, {
    image: U('1494976388531-d1058494cdd8'),
    name: 'Ford Mustang GT',
    price: '₹68.0 L',
    tag: 'Premium',
    specs: ['2021', 'Petrol', '9,200 km']
  }, {
    image: U('1568605117036-5fe5e7bab0b7'),
    name: 'Tata Nexon EV',
    price: '₹16.4 L',
    tag: 'EV',
    specs: ['2024', 'Electric', '465 km range']
  }],
  bikes: [{
    image: U('1568772585407-9361f9bf3a87'),
    name: 'Royal Enfield Classic',
    price: '₹2.1 L',
    tag: 'New',
    specs: ['2024', '350cc']
  }, {
    image: U('1558981403-c5f9899a28bc'),
    name: 'Ola S1 Pro',
    price: '₹1.3 L',
    tag: 'EV',
    specs: ['2024', 'Electric']
  }],
  categories: [{
    icon: 'car',
    name: 'Cars',
    blurb: 'New, used, and premium car inventory.'
  }, {
    icon: 'bike',
    name: 'Bikes & Scooters',
    blurb: 'Showcase your two-wheeler lineup.'
  }, {
    icon: 'ev',
    name: 'EV Dealers',
    blurb: 'Range, charging, and EV-first layouts.'
  }, {
    icon: 'auto',
    name: 'Autos & Three-Wheelers',
    blurb: 'Built for commercial and last-mile.'
  }, {
    icon: 'used',
    name: 'Used Vehicle Dealers',
    blurb: 'Trust-building pages for pre-owned.'
  }, {
    icon: 'brands',
    name: 'Multi-Brand Dealers',
    blurb: 'One website for every brand you sell.'
  }],
  steps: [{
    title: 'Add details',
    blurb: 'Showroom name, location, and contact — in minutes.'
  }, {
    title: 'Choose vehicles',
    blurb: 'Pick the categories you sell: cars, bikes, EVs, autos.'
  }, {
    title: 'Pick style',
    blurb: 'Choose a template and apply your brand colours.'
  }, {
    title: 'Add inventory',
    blurb: 'Upload vehicles with photos, prices, and specs.'
  }, {
    title: 'Go live',
    blurb: 'Publish on a free subdomain or your own domain.'
  }],
  leads: [{
    icon: 'enquiry',
    name: 'Enquiries',
    blurb: 'Forms on every vehicle page.'
  }, {
    icon: 'phone',
    name: 'Calls',
    blurb: 'Tap-to-call from any device.'
  }, {
    icon: 'whatsapp',
    name: 'WhatsApp',
    blurb: 'Instant chat with one tap.'
  }, {
    icon: 'testdrive',
    name: 'Test Drives',
    blurb: 'Booking requests, scheduled.'
  }, {
    icon: 'dashboard',
    name: 'Lead Dashboard',
    blurb: 'Every lead in one place.'
  }],
  brandControls: [{
    icon: 'logo',
    name: 'Add your logo',
    blurb: 'Upload once — applied site-wide.'
  }, {
    icon: 'palette',
    name: 'Use brand colours',
    blurb: 'Match your showroom identity.'
  }, {
    icon: 'template',
    name: 'Choose a template',
    blurb: 'Five dealer-ready layouts.'
  }, {
    icon: 'globe',
    name: 'Free subdomain',
    blurb: 'yourname.dealersite.pro, instantly.'
  }, {
    icon: 'link',
    name: 'Connect your domain',
    blurb: 'Point your own .com or .in.'
  }],
  templates: [{
    name: 'Clean Showroom',
    tag: 'Cars',
    image: U('1492144534655-ae79c964c9d7')
  }, {
    name: 'Premium Used Cars',
    tag: 'Used',
    image: U('1503736334956-4c8f8e92946d')
  }, {
    name: 'Performance Bikes',
    tag: 'Bikes',
    image: U('1558981806-ec527fa84c39')
  }, {
    name: 'Family Dealer',
    tag: 'Family',
    image: U('1605559424843-9e4c228bf1c2')
  }, {
    name: 'Auto & Three-Wheeler',
    tag: 'Auto',
    image: U('1519003722824-194d4455a60c')
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/icons.jsx
try { (() => {
// DealerSite Pro — line icon set (Lucide-style: 24px, stroke 1.75, round).
// No brand icon assets were supplied; this is a consistent custom line set
// matching premium editorial styling. Swap for a licensed set if available.
const Svg = ({
  size = 24,
  children,
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: style
}, children);
const Icons = {
  car: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 16v-2a2 2 0 0 1 1-1.7L5 11h14l1 .3A2 2 0 0 1 21 14v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "13.5",
    r: ".6",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "13.5",
    r: ".6",
    fill: "currentColor"
  })),
  bike: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "5.5",
    cy: "17",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18.5",
    cy: "17",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 17l3.2-6h4.3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.7 11L9 7H6.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11l2.5 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 7h3l-1 2"
  })),
  ev: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z"
  })),
  auto: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h10v8H3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 10h4l3 3v2h-7z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 7V5h10v2"
  })),
  used: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 13.5l1.5 1.5 3-3"
  })),
  brands: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 7.5l8 4.5 8-4.5"
  })),
  enquiry: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 5h16v11H8l-4 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 9h8M8 12h5"
  })),
  phone: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
  })),
  whatsapp: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 20l1.4-4A8 8 0 1 1 8 18.6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 10c0 3 2 5 5 5l.8-1.6-2-.9-.8.9a4 4 0 0 1-2-2l.9-.8-.9-2z"
  })),
  testdrive: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.2 10.8l3-2.3"
  })),
  dashboard: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "8",
    height: "8",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "3",
    width: "8",
    height: "5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "10",
    width: "8",
    height: "11",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "13",
    width: "8",
    height: "8",
    rx: "1.5"
  })),
  palette: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "11",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "7.5",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14.5",
    cy: "7.5",
    r: "1",
    fill: "currentColor"
  })),
  swatch: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "4",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "14",
    width: "6",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
  })),
  globe: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"
  })),
  link: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 15l6-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 6.5l1.5-1.5a4 4 0 0 1 5.5 5.5L15 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 17.5L12 19a4 4 0 0 1-5.5-5.5L9 11"
  })),
  template: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18M9 9v11"
  })),
  logo: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.5h2.5a3.5 3.5 0 0 1 0 7H9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.5v7"
  })),
  check: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })),
  arrowRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 12h15M13 6l6 6-6 6"
  })),
  arrowUpRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M7 17L17 7M8 7h9v9"
  })),
  chevronRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })),
  star: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.6L20.5 9.4l-4.3 4.1 1 6L12 16.8 6.8 19.5l1-6-4.3-4.1 5.9-.8z",
    fill: "currentColor",
    stroke: "none"
  })),
  spark: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z",
    fill: "currentColor",
    stroke: "none"
  })),
  play: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M7 5l11 7-11 7z",
    fill: "currentColor",
    stroke: "none"
  })),
  menu: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M3 12h18M3 18h18"
  })),
  mapPin: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.5"
  })),
  fuel: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "3",
    width: "9",
    height: "18",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 8h3l2 2v7a1.5 1.5 0 0 1-3 0v-4h-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 11h9"
  })),
  gauge: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M4 16a8 8 0 1 1 16 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16l4-4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "16",
    r: "1.2",
    fill: "currentColor"
  })),
  search: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 16l4.5 4.5"
  }))
};
window.Icons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.StepPills = __ds_scope.StepPills;

__ds_ns.VehicleCard = __ds_scope.VehicleCard;

})();
