import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  KeyboardAvoidingScrollView,
  Screen,
  WarningCard,
} from '@axelor/aos-mobile-ui';
import {useTranslator} from '../../../i18n';
import {usePermitted} from '../../../permissions';
import {
  Action,
  DisplayField,
  DisplayPanel,
  FormatedAction,
  getActionConfig,
  getConfigItems,
  getFields,
  getValidationErrors,
  getZIndexStyle,
  isField,
  mapErrorWithTranslationKey,
  sortContent,
  useFormConfig,
  validateSchema,
} from '../../../forms';
import {Field as FieldComponent, Panel as PanelComponent} from './Components';
import {ConstraintsValidatorPopup} from './Alerts';
import {clearRecord} from '../../../features/formSlice';
import {areObjectsEquals, isEmpty} from '../../../utils';
import {FloatingTools} from './Buttons';

interface FormProps {
  style?: any;
  defaultValue?: any;
  creationDefaultValue?: any;
  formKey: string;
  isCustom?: boolean;
  actions: Action[];
  floatingTools?: boolean;
  defaultEditMode?: boolean;
  styleScreen?: any;
  hideButtonBackground?: boolean;
}

const FormView = ({
  style,
  defaultValue,
  creationDefaultValue,
  formKey,
  isCustom = false,
  actions: _actions,
  floatingTools = true,
  defaultEditMode = false,
  styleScreen,
  hideButtonBackground = false,
}: FormProps) => {
  const I18n = useTranslator();
  const dispatch = useDispatch();

  const {config} = useFormConfig(formKey);

  // FIXED: Select only specific slices instead of entire store
  const {record} = useSelector((state: any) => state.form);
  const authState = useSelector((state: any) => state.auth);
  const userState = useSelector((state: any) => state.user);

  // Create a minimal store subset for functions that need store access
  // Only recreate if these specific values actually changed
  const storeSubset = useMemo(
    () => ({
      auth: authState,
      user: userState,
      form: {record},
    }),
    [authState, userState, record],
  );

  const {canCreate, canDelete, readonly} = usePermitted({
    modelName: config?.modelName,
  });

  const [object, setObject] = useState(
    defaultValue ?? creationDefaultValue ?? {},
  );
  const [errors, setErrors] = useState<any[]>();
  const [isReadonly, setIsReadonly] = useState<boolean>(
    floatingTools && !defaultEditMode,
  );
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  // PERFORMANCE DEBUG: Track renders and prop changes
  const renderCountRef = useRef(0);
  const prevPropsRef = useRef<any>({});

  renderCountRef.current++;

  // OPTIMIZED: Memoize expensive computations
  const formContent: (DisplayPanel | DisplayField)[] = useMemo(
    () => sortContent(config),
    [config],
  );

  const fieldsMemo = useMemo(() => getFields(config), [config]);
  const configItemsMemo = useMemo(() => getConfigItems(config), [config]);

  const isCreation = useMemo(
    () => !isCustom && object?.id == null,
    [isCustom, object?.id],
  );

  // OPTIMIZED: Use fingerprint comparison for better performance on large objects
  const objectFingerprint = useMemo(() => {
    try {
      return JSON.stringify(object || {});
    } catch {
      return String(object);
    }
  }, [object]);

  const defaultFingerprint = useMemo(() => {
    try {
      return JSON.stringify(defaultValue || {});
    } catch {
      return String(defaultValue);
    }
  }, [defaultValue]);

  const isDirty = useMemo(() => {
    if (isCreation) return true;

    // Use fingerprint comparison for consistent results
    return defaultFingerprint !== objectFingerprint;
  }, [isCreation, defaultFingerprint, objectFingerprint]);

  useEffect(() => {
    mapErrorWithTranslationKey();
  }, []);

  useEffect(() => {
    dispatch(clearRecord());
  }, [dispatch]);

  // FIXED: Simplified object state management to prevent render loops
  useEffect(() => {
    if (!isEmpty(record)) {
      // If we have a record from store, use it (for edit mode)
      if (!areObjectsEquals(object, record)) {
        setObject(record);
      }
    } else {
      // For creation mode or when no record
      const _default = defaultValue ?? creationDefaultValue ?? {};

      if (_default && Object.keys(_default).length > 0) {
        // Only update if current object is empty or significantly different
        const currentIsEmpty = !object || Object.keys(object).length === 0;

        if (
          currentIsEmpty ||
          (!isDirty && !areObjectsEquals(object, _default))
        ) {
          setObject(_default);
        }
      }
    }
  }, [record, defaultValue, creationDefaultValue, object, isDirty]); // Removed circular dependencies

  // OPTIMIZED: Use memoized fields and store subset
  const handleFieldChange = useCallback(
    (newValue: any, fieldName: string) => {
      setObject(_current => {
        if (_current?.[fieldName] === newValue) {
          return _current;
        }

        const updatedObject = _current != null ? {..._current} : {};
        updatedObject[fieldName] = newValue;

        // Use memoized fields and store subset
        try {
          if (fieldsMemo && Array.isArray(fieldsMemo)) {
            fieldsMemo
              .filter(_field => _field.dependsOn != null)
              .filter(_field =>
                Object.keys(_field.dependsOn).includes(fieldName),
              )
              .forEach(_field => {
                try {
                  updatedObject[_field.key] = _field.dependsOn[fieldName]({
                    newValue,
                    storeState: storeSubset,
                    objectState: updatedObject,
                    dispatch,
                  });
                } catch (error) {
                  console.error('Error in field dependency:', error);
                }
              });
          }
        } catch (error) {
          console.error('Error handling field dependencies:', error);
        }

        return updatedObject;
      });
    },
    [fieldsMemo, storeSubset, dispatch],
  );

  const isButtonAuthorized = useCallback(
    (_action: Action) => {
      switch (_action.type) {
        case 'create':
          return canCreate;
        case 'update':
          return !readonly;
        case 'delete':
          return canDelete;
        default:
          return true;
      }
    },
    [canCreate, canDelete, readonly],
  );

  const toggleReadonlyMode = useCallback(() => {
    setIsReadonly(currentState => !currentState);
  }, []);

  const handleReset = useCallback(() => {
    setObject((isCreation ? creationDefaultValue : defaultValue) ?? {});
  }, [creationDefaultValue, defaultValue, isCreation]);

  const handleValidate = useCallback(
    (_action: Function, needValidation?: boolean) => {
      if (needValidation && config) {
        return validateSchema(config, object)
          .then(() => {
            _action(object);
          })
          .catch(_error => {
            setErrors(getValidationErrors(_error));
          });
      }

      return new Promise<void>(resolve => {
        _action(object);
        resolve();
      });
    },
    [config, object],
  );

  // OPTIMIZED: Use store subset and reduced dependencies
  const actions: FormatedAction[] = useMemo(() => {
    if (!Array.isArray(_actions) || _actions.length === 0) {
      return [];
    }

    const results: FormatedAction[] = [];

    for (const _action of _actions) {
      try {
        if (!isButtonAuthorized(_action)) continue;

        // hideIf en sécurité
        let hidden = false;
        if (typeof _action.hideIf === 'function') {
          try {
            hidden =
              _action.hideIf({objectState: object, storeState: storeSubset}) ===
              true;
          } catch (err) {
            console.error(
              `[FormView] hideIf a planté pour l'action ${_action.key}`,
              err,
            );
          }
        }
        if (hidden) continue;

        // getActionConfig en sécurité
        try {
          const cfg = getActionConfig(
            _action,
            config,
            {
              handleObjectChange: setObject,
              objectState: object,
              storeState: storeSubset,
              dispatch,
              handleReset,
            },
            I18n,
          );
          if (cfg) results.push(cfg);
        } catch (err) {
          console.error(
            `[FormView] getActionConfig a planté pour l'action ${_action.key}`,
            err,
          );
        }
      } catch (err) {
        console.error(
          "[FormView] erreur inattendue lors du traitement d'une action",
          _action?.key,
          err,
        );
      }
    }

    return results;
  }, [
    _actions,
    config,
    dispatch,
    handleReset,
    I18n,
    isButtonAuthorized,
    object,
    storeSubset,
  ]);

  const renderAction = useCallback(
    (_action: FormatedAction) => {
      const onPress = () =>
        handleValidate(() => {
          _action.onPress();
          if (_action.readonlyAfterAction) {
            toggleReadonlyMode();
          }
        }, _action.needValidation);

      if (_action.customComponent) {
        return React.cloneElement(_action.customComponent, {
          key: _action.key,
          onPress: onPress,
          objectState: object,
          handleObjectChange: setObject,
          disabled: _action.isDisabled,
        });
      }

      return (
        <Button
          key={_action.key}
          iconName={_action.iconName}
          color={_action.color}
          title={_action.title}
          onPress={onPress}
          disabled={_action.isDisabled}
        />
      );
    },
    [handleValidate, object, toggleReadonlyMode],
  );

  // OPTIMIZED: Stabilize callbacks to prevent re-renders
  const globalReadonlyCheck = useCallback(() => {
    return (
      isReadonly ||
      (config?.readonlyIf &&
        config.readonlyIf({objectState: object, storeState: storeSubset}))
    );
  }, [isReadonly, config, object, storeSubset]);

  const renderItem = useCallback(
    (item: DisplayPanel | DisplayField) => {
      if (isField(item)) {
        return (
          <FieldComponent
            key={`${item.key} - ${item.order}`}
            handleFieldChange={handleFieldChange}
            _field={item as DisplayField}
            object={object}
            modelName={config?.modelName}
            globalReadonly={globalReadonlyCheck}
            formContent={configItemsMemo}
          />
        );
      }

      return (
        <PanelComponent
          key={`${item.key} - ${item.order}`}
          renderItem={renderItem}
          formContent={configItemsMemo}
          _panel={item as DisplayPanel}
        />
      );
    },
    [
      handleFieldChange,
      object,
      config?.modelName,
      globalReadonlyCheck,
      configItemsMemo,
    ],
  );

  // PERFORMANCE LOG: Track what's causing re-renders
  if (renderCountRef.current > 5) {
    const currentProps = {
      defaultValue,
      creationDefaultValue,
      formKey,
      actions: _actions,
    };

    console.log(`[FormView] render #${renderCountRef.current}`, {
      objectId: object?.id,
      defaultValueId: defaultValue?.id || 'none',
      creationDefaultValueStable: !!creationDefaultValue,
      actionsStable: _actions === prevPropsRef.current.actions,
      configStable: config === prevPropsRef.current.config,
      recordStable: record === prevPropsRef.current.record,
    });

    prevPropsRef.current = {
      ...currentProps,
      config,
      record,
    };
  }

  if (config == null) {
    return (
      <View>
        <WarningCard errorMessage={I18n.t('Base_FormNotFound')} />
      </View>
    );
  }

  if (!isCustom && object?.id == null && !canCreate) {
    return (
      <View>
        <WarningCard errorMessage={I18n.t('Base_FormMissingCreateAccess')} />
      </View>
    );
  }

  return (
    <Screen
      hideButtonBackground={hideButtonBackground}
      fixedItems={
        <View
          onLayout={({nativeEvent}) => {
            setButtonHeight(nativeEvent.layout.height);
          }}>
          {isReadonly
            ? undefined
            : actions
                .filter(_action => !floatingTools || _action.type === 'custom')
                .map(renderAction)}
        </View>
      }
      style={styleScreen}
      removeSpaceOnTop={true}>
      <KeyboardAvoidingScrollView
        keyboardOffset={{ios: 70, android: 100}}
        style={styles.scroll}>
        {Array.isArray(errors) && (
          <ConstraintsValidatorPopup
            onContinue={() => setErrors(null)}
            errors={errors}
          />
        )}
        <View style={[styles.container, style, getZIndexStyle(5)]}>
          {formContent.map(renderItem)}
        </View>
      </KeyboardAvoidingScrollView>
      <FloatingTools
        hideIf={!floatingTools}
        style={{bottom: buttonHeight + 20}}
        toggleReadonly={toggleReadonlyMode}
        actions={actions}
        isCreation={isCreation}
        onCreate={() => setObject(creationDefaultValue)}
        onPressWrapper={handleValidate}
        isDirty={isDirty}
        defaultOpenValue={defaultEditMode}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    height: null,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 125,
  },
});

export default FormView;
