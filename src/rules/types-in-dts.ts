import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

type Options = [
  {
    allowEnums?: boolean;
    allowDeclare?: boolean;
  }?
];

export default ESLintUtils.RuleCreator(
  () =>
    "https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/types-in-dts.md"
)({
  name: "types-in-dts",

  meta: {
    type: "problem",
    docs: {
      description:
        "Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files."
    },
    schema: [
      {
        type: "object",
        properties: {
          allowEnums: { type: "boolean" },
          allowDeclare: { type: "boolean" }
        },
        additionalProperties: false
      }
    ],
    messages: {
      moveToDts:
        "Type declarations must be defined in a .d.ts file."
    }
  },

  defaultOptions: [
    {
      allowEnums: false,
      allowDeclare: false
    }
  ],

  create(context, [options]) {
    const allowEnums = Boolean(options.allowEnums);
    const allowDeclare = Boolean(options.allowDeclare);

    function isDtsFile(filename: string): boolean {
      if (!filename || filename === "<input>") {
        return false;
      }

      return filename.endsWith(".d.ts");
    }

    function hasDeclareModifier(
      node:
        | TSESTree.TSTypeAliasDeclaration
        | TSESTree.TSInterfaceDeclaration
        | TSESTree.TSEnumDeclaration
    ): boolean {
      // `declare type Foo = ...`
      if ("declare" in node && node.declare === true) {
        return true;
      }

      const modifiers =
        "modifiers" in node && Array.isArray(node.modifiers)
          ? node.modifiers
          : [];

      return modifiers.some(
        m => m?.type === "TSDeclareKeyword"
      );
    }

    function reportIfNotDts(
      node:
        | TSESTree.TSTypeAliasDeclaration
        | TSESTree.TSInterfaceDeclaration
        | TSESTree.TSEnumDeclaration
    ): void {
      const filename = context.getFilename();

      if (isDtsFile(filename)) {
        return;
      }

      if (allowDeclare && hasDeclareModifier(node)) {
        return;
      }

      context.report({
        node,
        messageId: "moveToDts"
      });
    }

    return {
      TSTypeAliasDeclaration(
        node: TSESTree.TSTypeAliasDeclaration
      ) {
        reportIfNotDts(node);
      },

      TSInterfaceDeclaration(
        node: TSESTree.TSInterfaceDeclaration
      ) {
        reportIfNotDts(node);
      },

      TSEnumDeclaration(
        node: TSESTree.TSEnumDeclaration
      ) {
        if (allowEnums) {
          return;
        }

        reportIfNotDts(node);
      }
    };
  }
});