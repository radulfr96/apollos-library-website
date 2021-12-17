import * as yup from 'yup';

export default {
    equalTo(ref: any, msg: any) {
        return yup.mixed().test({
            name: 'equalTo',
            exclusive: false,
            // eslint-disable-next-line no-template-curly-in-string
            message: msg || '${path} must be the same as ${reference}',
            params: {
                reference: ref.path,
            },
            test(value: any) {
                return value === this.resolve(ref);
            },
        });
    },
};
