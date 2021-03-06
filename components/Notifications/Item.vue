<template>
  <div class="notification option" :class="{ 'unseen' : notification.unseen}">
    <author class="author"
            :user="notificationMeta.user"
            :created-at="notificationMeta.createdAt" />
    <p class="notification-message" v-html="message"></p>
  </div>
</template>

<script>
  import author from '~/components/Author/Author.vue'
  import { isEmpty } from 'lodash'
  import sanitize from 'sanitize-html'

  export default {
    name: 'hc-notification-item',
    components: {
      'author': author
    },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    computed: {
      notificationMeta () {
        const metaExists = !isEmpty(this.notification[this.type])
        const meta = metaExists ? this.notification[this.type] : this.notification
        return {
          user: meta.organization || meta.user || null,
          createdAt: meta.createdAt || '',
          title: meta.title || ''
        }
      },
      userName () {
        let username = this.notificationMeta.user ? this.notificationMeta.user.name : this.$t('component.contribution.creatorUnknown')
        return username || this.$t('component.contribution.creatorUnknown')
      },
      type () {
        return this.notification.type || 'comment'
      },
      message () {
        return this.notification.message || this.$t(`component.notification.message.${this.type}`, this.messageParams)
      },
      messageParams () {
        let excerpt = !isEmpty(this.notification.comment) ? this.notification.comment.contentExcerpt : ''
        excerpt = (!excerpt && !isEmpty(this.notification.contribution)) ? this.notification.contribution.contentExcerpt : excerpt

        return {
          userName: this.userName,
          title: !isEmpty(this.notification.contribution) ? this.notification.contribution.title : '',
          excerpt: sanitize(excerpt, {allowedTags: []})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .author {
    pointer-events: none;
  }

  .option {
    border-bottom: 1px solid lighten($grey-lighter, 8%);
    transition: all .2s ease-out;
    padding: 0.5rem 1rem;
    margin-bottom: 0;
    cursor: pointer;
    background-color: lighten($grey-lighter, 10%);
    border-radius: 0;
    opacity: 0.7;

    &:hover {
      background-color: darken($white, 5%);
      opacity: 1;
    }

    &.unseen {
      opacity: 1;
      background-color: $white;
      border-left: 5px solid $green;
      padding-left: 0.65rem;

      &:hover {
        background-color: darken($white, 5%);
        opacity: 1;
      }
    }

    &:last-of-type {
      border-bottom: 0;
    }
  }

  .notification-message {
    // margin-top: 0.5em;
    padding: 1rem 0 0.5rem;
  }

  .notification {
    width: 100%;

    p {
      font-size: $size-7;
    }
  }
</style>
